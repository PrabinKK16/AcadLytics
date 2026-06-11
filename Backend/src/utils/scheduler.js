import cron from "node-cron";
import FeedbackForm from "../models/feedbackForm.model.js";
import Enrollment from "../models/enrollment.model.js";
import Notification from "../models/notification.model.js";
import sendEmail from "./sendEmail.js";
import logActivity from "./logActivity.js";
import { snapshotCourseAnalytics } from "./analytics.service.js";

const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 1500;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const sendEmailsInBatches = async (students, form) => {
  for (let i = 0; i < students.length; i += BATCH_SIZE) {
    const batch = students.slice(i, i + BATCH_SIZE);

    await Promise.allSettled(
      batch.map((student) =>
        sendEmail({
          to: student.email,
          subject: "Feedback Deadline Reminder — AcadLytics",
          html: `
            <h2>Hello ${student.name},</h2>
            <p>Your feedback form <strong>${form.title}</strong> will close within 24 hours.</p>
            <p>Please submit your feedback before the deadline.</p>
          `,
        }).catch((err) =>
          console.error(
            `Scheduler: email failed for student ${student._id}:`,
            err.message
          )
        )
      )
    );

    if (i + BATCH_SIZE < students.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }
};

const startSchedulers = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();
      const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const expiredForms = await FeedbackForm.find({
        isActive: true,
        deadline: { $lt: now },
      });

      for (const form of expiredForms) {
        form.isActive = false;
        await form.save({ validateBeforeSave: false });

        snapshotCourseAnalytics(form.course).catch((err) =>
          console.error(
            `Scheduler: snapshot failed for form ${form._id}:`,
            err.message
          )
        );

        logActivity({
          user: null,
          action: "FEEDBACK_FORM_AUTO_CLOSED",
          metadata: { formId: form._id, course: form.course },
        });
      }

      const reminderForms = await FeedbackForm.find({
        isActive: true,
        reminderSent: false,
        deadline: { $gte: now, $lte: next24Hours },
      });

      for (const form of reminderForms) {
        const enrollments = await Enrollment.find({
          course: form.course,
        }).populate("student", "name email _id");

        const validStudents = enrollments
          .filter((e) => e.student)
          .map((e) => e.student);

        if (validStudents.length > 0) {
          const notificationDocs = validStudents.map((student) => ({
            recipient: student._id,
            type: "alert",
            message: `Reminder: feedback form "${form.title}" closes within 24 hours`,
          }));

          await Notification.insertMany(notificationDocs, { ordered: false });

          await sendEmailsInBatches(validStudents, form);
        }

        form.reminderSent = true;
        await form.save({ validateBeforeSave: false });

        logActivity({
          user: null,
          action: "FEEDBACK_REMINDER_SENT",
          metadata: {
            formId: form._id,
            course: form.course,
            totalStudents: validStudents.length,
          },
        });
      }
    } catch (error) {
      console.error("Scheduler Error:", error.message);
    }
  });
};

export default startSchedulers;

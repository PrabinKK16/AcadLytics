import cron from "node-cron";
import FeedbackForm from "../models/feedbackForm.model.js";
import Enrollment from "../models/enrollment.model.js";
import Notification from "../models/notification.model.js";
import sendEmail from "./sendEmail.js";
import logActivity from "./logActivity.js";

const startSchedulers = () => {
  cron.schedule("* * * * *", async () => {
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

        await logActivity({
          user: null,
          action: "FEEDBACK_FORM_AUTO_CLOSED",
          metadata: {
            formId: form._id,
            course: form.course,
          },
        });
      }

      const reminderForms = await FeedbackForm.find({
        isActive: true,
        reminderSent: false,
        deadline: {
          $gte: now,
          $lte: next24Hours,
        },
      });

      for (const form of reminderForms) {
        const enrollments = await Enrollment.find({
          course: form.course,
        }).populate("student");

        for (const enrollment of enrollments) {
          const student = enrollment.student;
          if (!student) continue;

          await Notification.create({
            recipient: student._id,
            type: "alert",
            message: `Reminder: feedback form "${form.title}" closes within 24 hours`,
          });

          await sendEmail({
            to: student.email,
            subject: "Feedback Deadline Reminder",
            html: `
              <h2>Hello ${student.name}</h2>
              <p>Your feedback form <strong>${form.title}</strong> will close within 24 hours.</p>
              <p>Please submit your feedback before the deadline.</p>
            `,
          });
        }

        form.reminderSent = true;
        await form.save({ validateBeforeSave: false });

        await logActivity({
          user: null,
          action: "FEEDBACK_REMINDER_SENT",
          metadata: {
            formId: form._id,
            course: form.course,
            totalStudents: enrollments.length,
          },
        });
      }
    } catch (error) {
      console.error("Scheduler Error:", error.message);
    }
  });
};

export default startSchedulers;

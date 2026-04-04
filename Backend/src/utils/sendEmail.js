import nodemailer from "nodemailer";
import ApiError from "./ApiError";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"AcadLytics" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    throw new ApiError(500, "Failed to send email", [error.message]);
  }
};

export default sendEmail;

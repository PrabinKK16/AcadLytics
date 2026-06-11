import nodemailer from "nodemailer";
import ApiError from "./ApiError.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: (process.env.SMTP_PASSWORD || "").replace(/\s/g, ""),
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

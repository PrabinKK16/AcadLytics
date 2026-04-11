AcadLytics Backend

A production-ready MERN backend for academic feedback analytics and CO attainment tracking.

This backend powers a modern EdTech analytics platform with:

JWT authentication + refresh token flow

Google OAuth login

Role-based access control (admin, faculty, student)

Course and feedback form management

Question → CO mapping with weightage

Student feedback submissions

CO attainment analytics + faculty trend snapshots

Notification center with pagination

Avatar upload using Cloudinary

Automated feedback reminders using cron jobs

CSV export for analytics reports

Activity logging for audit trail

---

🚀 Tech Stack

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Passport Google OAuth 2.0

Cloudinary

Multer

Node Cron

Nodemailer

---

📁 Project Structure

src/
├── config/
├── controllers/
├── db/
├── middlewares/
├── models/
├── routes/
├── utils/
├── public/uploads/
├── app.js
├── constants.js
└── index.js

---

🔐 Features

Authentication

Signup / Login

Google OAuth login

Refresh token rotation

Current user endpoint

Logout

Profile

Update profile

Change password

Upload avatar

Remove avatar

Admin

Create courses

Create feedback forms

Add questions with CO mapping

Student

Get active feedback forms

Submit feedback once per form

Faculty Analytics

Course analytics

CO attainment levels

CSV export

Semester trend analytics

Notifications

Paginated notifications

Unread count

Mark as read

Delete notification

Automation

Auto close expired feedback forms

24-hour reminder emails

Reminder notifications

🛠️ Installation

npm install

Run development server:

npm run dev

Run production:

npm start

---

📡 Main API Modules

Auth

POST /api/v1/auth/signup

POST /api/v1/auth/login

POST /api/v1/auth/refresh-token

GET /api/v1/auth/google

GET /api/v1/auth/me

POST /api/v1/auth/logout

Admin

POST /api/v1/admin/course

POST /api/v1/admin/feedback-form

POST /api/v1/admin/question

Feedback

GET /api/v1/feedback/active/:courseId

POST /api/v1/feedback/submit

Analytics

GET /api/v1/analytics/course/:courseId

GET /api/v1/analytics/course/:courseId/export/csv

GET /api/v1/analytics/faculty/:facultyId/trend

Profile

PATCH /api/v1/profile

PATCH /api/v1/profile/avatar

DELETE /api/v1/profile/avatar

PATCH /api/v1/profile/change-password

Notifications

GET /api/v1/notifications?page=1&limit=10

GET /api/v1/notifications/unread-count

PATCH /api/v1/notifications/:id/read

DELETE /api/v1/notifications/:id

---

📈 Analytics Logic

The analytics engine computes:

Total submissions

Average rating score

CO-wise attainment percentage

CO level classification:

High → ≥ 70%

Medium → ≥ 40%

Low → < 40%

Snapshots are stored for semester trend analysis.

---

☁️ Media Upload Flow

Avatar uploads use:

multer → temp file storage in src/public/uploads

Cloudinary upload

local temp cleanup after upload

---

🧠 Future Scope

PDF analytics reports

Department-wide analytics

AI insight generation

Weak CO recommendation engine

Faculty performance dashboard

Student submission heatmaps

---

👨‍💻 Author

Built by Prabin Kumar Khamania as a modern EdTech SaaS analytics platform.

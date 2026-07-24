# Sadhana Nivriti School — Management System

School: Sadhana Nivriti School, Chotpur, Noida
Session: 2025-26
Live URL (after deploy): https://muthootnoida.github.io/schoolmanagement

## Phase 1 modules
- Admissions & Enrolment (auto admission numbers, roll numbers, TC issuance)
- Classroom Management (Classes 1-10 sections, subjects, class teachers)
- Attendance Tracking (teacher marking, admin override, live dashboard)
- Exams & Marks (CBSE pattern, auto A1-E grades, pass/fail results)
- Fee Collection (printable receipts, collection history, daily totals)
- Timetable Management (period-wise weekly schedule per class)

## Three panels
| Panel | Default passcode | Page |
|---|---|---|
| Admin | roshanbhagat92 | admin.html |
| Teacher | teacher@123 | teacher.html |
| Parent | parent@123 | parent.html |

All passcodes changeable from Settings inside each panel.
Parents view their child using the admission number (e.g. SNS/2026/0001).

## Deploy to GitHub Pages
1. Create repo: muthootnoida/schoolmanagement
2. Upload all files (index.html, admin.html, teacher.html, parent.html, app.js, style.css)
3. Settings > Pages > Branch: main, folder: / (root) > Save
4. Live in 2-3 minutes at https://muthootnoida.github.io/schoolmanagement

## Important — data & backup
- All data is stored in the browser localStorage of the device used.
- The Admin device (school laptop) is the primary data holder.
- Export a backup regularly: Admin > Settings > Export backup.
- Restore on a new device: Admin > Settings > Import backup.
- "Load demo data" adds sample students/teachers to explore the system.

## Tested (automated, 17 scenarios)
Login/auth guard, wrong-passcode rejection, student admission with auto
numbering, teacher management, attendance marking + live dashboard update,
exam scheduling, marks entry with CBSE grades, results computation, fee
collection + printable receipt, timetable save, enquiry tracking, passcode
change flow, teacher panel, parent portal (child lookup, marks, fees,
timetable), direct-URL access blocking, full backup export/import, and
mobile navigation (390px viewport).

# Deployment Guide

## What is safe to upload to GitHub

Upload the website files, `preview-server.js`, `package.json`, and `.env.example`.

Do not upload `.env`. It contains private Google credentials.

The `.gitignore` file blocks `.env` and `.env.*` from Git by default while allowing `.env.example`.

## Railway hosting

Railway can deploy this as a Node.js app from GitHub.

1. Push this folder to a GitHub repository.
2. In Railway, create a new project.
3. Choose deploy from GitHub repo.
4. Select the repository.
5. Railway should detect `package.json` and run `npm start`.
6. In the Railway service, open the Variables tab.
7. Add the same values from your local `.env` file as Railway variables.
8. Deploy the service.

Required variables:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_CALENDAR_ID=
BLOCKING_CALENDAR_IDS=
VIDEO_SURVEY_CALENDAR_ID=
PHYSICAL_SURVEY_CALENDAR_ID=
BUSINESS_TIMEZONE=Europe/London
SURVEY_DAYS_AHEAD=14
SURVEY_WORKDAY_START=09:00
SURVEY_WORKDAY_END=17:00
SURVEY_SLOT_STEP_MINUTES=30
VIDEO_SURVEY_DURATION_MINUTES=30
PHYSICAL_SURVEY_DURATION_MINUTES=60
```

Railway provides a temporary public domain for the deployed service. When the real website is ready, point the production domain to the Railway service.

## Database note

The current booking system does not need a database because Google Calendar is the source of truth for availability and bookings.

Add a Railway PostgreSQL database later if you want to store enquiry records, CRM sync logs, audit history, or customer booking records outside Google Calendar.

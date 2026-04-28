# Google Calendar Booking Setup

The website now asks the local backend for survey availability and sends bookings to the backend.

## How it works

1. The backend checks your blocking calendar events and the busy times across video and physical survey calendars.
2. It builds available survey slots around your working hours.
3. When a client books, the backend creates a private Google Calendar event in the correct service calendar.
4. That time then becomes busy and disappears from future availability.

## Files

- `preview-server.js` serves the site and contains the Google Calendar API connection.
- `.env.example` shows the private settings needed for Google Calendar.
- `script.js` calls `/api/survey-availability` and `/api/survey-bookings`.

## Configuration

Create a private `.env` file based on `.env.example`.

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
BUSINESS_TIMEZONE=Europe/London

BLOCKING_CALENDAR_IDS=primary
VIDEO_SURVEY_CALENDAR_ID=your-video-calendar-id
PHYSICAL_SURVEY_CALENDAR_ID=your-physical-calendar-id
```

Recommended calendar setup:

- `BLOCKING_CALENDAR_IDS`: calendar or calendars used to block your availability. Every non-cancelled event on these calendars is treated as unavailable, even if Google marks it as free.
- `VIDEO_SURVEY_CALENDAR_ID`: calendar where new video survey bookings are created.
- `PHYSICAL_SURVEY_CALENDAR_ID`: calendar where new physical survey bookings are created.

The form treats all blocking calendar events plus busy events on the video and physical calendars as unavailable, so a video booking can also prevent a physical booking at the same time.

## Go-live note

The browser must not talk to Google Calendar directly because it would expose private credentials. A backend is required for the live website.

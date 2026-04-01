# Mergington High School Activities

A website application that allows students to view and sign up for extracurricular activities at Mergington High School, and allows teachers to manage student registrations.

## Features

- View all available extracurricular activities
- Search activities by name or description
- Filter activities by category (Sports, Arts, Academic, Community, Technology)
- Filter activities by day of the week
- Filter activities by time (Before School, After School, Weekend)
- Teacher login to authenticate and manage registrations
- Sign up a student for an activity (requires teacher login)
- Unregister a student from an activity (requires teacher login)

## Tech Stack

- **Backend:** Python with [FastAPI](https://fastapi.tiangolo.com/)
- **Database:** MongoDB
- **Frontend:** HTML, CSS, and JavaScript (no framework)

## Project Structure

```
src/
├── app.py               # FastAPI application entry point
├── requirements.txt     # Python dependencies
├── backend/
│   ├── database.py      # MongoDB connection and initial data
│   └── routers/
│       ├── activities.py  # Activity endpoints (list, sign up, unregister)
│       └── auth.py        # Teacher authentication endpoints
└── static/
    ├── index.html       # Main page
    ├── app.js           # Frontend logic
    └── styles.css       # Styles
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/activities` | List all activities (supports `day`, `start_time`, `end_time` filters) |
| GET | `/activities/days` | List all days that have activities |
| POST | `/activities/{name}/signup` | Sign up a student (teacher auth required) |
| POST | `/activities/{name}/unregister` | Unregister a student (teacher auth required) |
| POST | `/auth/login` | Teacher login |
| GET | `/auth/check-session` | Check if a teacher session is valid |

## Development Guide

For detailed setup and development instructions, please refer to our [Development Guide](../docs/how-to-develop.md).

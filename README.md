# Teacher App
<img width="1536" height="1024" alt="App UI 3" src="https://github.com/user-attachments/assets/0d129d04-3e65-4e5b-b750-6102fc838231" />

A modern coaching institute management application built with **React Native (Expo)** and **Supabase**, designed for teachers, students, and educational institutes.

## Features

### Teacher Portal

- Student Management
  - Add and manage students
  - Track attendance
  - Monitor performance and rankings
  - Manage payment status

- Batch Management
  - Create and manage batches
  - Categorize batches (JEE, NEET, Foundation, etc.)
  - Control admissions per batch
  - Track batch strength

- Admissions
  - Receive admission requests
  - Approve or reject applications
  - Automatic student enrollment after approval

- Tasks & DPPs
  - Create assignments and DPPs
  - Target specific batches, classes, or categories
  - Set deadlines and marks
  - Track completion

- Announcements
  - Broadcast announcements to:
    - All students
    - Specific batches
    - Specific classes
    - Batch categories (JEE, NEET, Foundation, etc.)

- Notes Sharing
  - Upload and distribute study materials
  - Batch-wise note delivery
  - Cloud storage integration

---

### Student Portal

- Student Authentication
- View announcements
- Access notes and study materials
- View assigned tasks and DPPs
- Track academic progress
- Receive batch-specific updates

---

## Tech Stack

### Frontend

- React Native
- Expo
- Expo Router
- TypeScript
- Zustand

### Backend

- Supabase
  - PostgreSQL
  - Authentication
  - Row Level Security (RLS)

### Storage

- Cloudflare R2 (for notes and documents)

---

## Database Modules

- Teachers
- Students
- Admissions
- Batches
- Tasks
- Announcements
- Notes

---

## Project Structure

```bash
src/
├── app/
│   ├── auth/
│   ├── teacher/
│   └── (tabs)/
├── components/
├── services/
├── store/
├── lib/
└── utils/
```

---

## Getting Started

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npx expo start
```

### Run Android

```bash
npx expo run:android
```

### Run iOS

```bash
npx expo run:ios
```

---

## Environment Variables

Create a `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Roadmap

- [ ] Notes Module
- [ ] Attendance Management
- [ ] Payment Tracking
- [ ] Push Notifications
- [ ] Student Progress Analytics
- [ ] Parent Portal
- [ ] WhatsApp Integration
- [ ] AI-powered Study Assistant

---

## Status

🚧 Currently under active development.

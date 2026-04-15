# Cal.com Clone: Scheduling Infrastructure

This repository contains a full-stack scheduling and booking web application, heavily inspired by the core functionalities of Cal.com. It is designed to allow a user to set their availability, define various event types, generate conflict-free time slots, and let public guests securely book meetings.

## System Architecture

The project is structured as a monorepo consisting of a decoupled frontend and backend:

1. **Frontend:** Built with Next.js (App Router), React, and Tailwind CSS. It communicates with the backend via a REST API client (`api.ts`).
2. **Backend:** Built with Express.js and TypeScript. 
3. **Database:** PostgreSQL database modeled and queried using Prisma ORM.

## Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS (v4), React Calendar
* **Backend:** Node.js, Express.js, TypeScript
* **Database & ORM:** PostgreSQL (Neon Serverless), Prisma
* **Utilities:** Nodemailer (Email generation), date-fns (Time parsing)

## Features Included

* **Event Type Management:** Create, edit, and delete meeting templates of arbitrary durations.
* **Complex Availability Handling:** Configure weekly default hours (e.g., Mon-Fri, 9am to 5pm).
* **Date Overrides:** Add specific dates where you are completely unavailable or have custom working hours.
* **Dynamic Slot Generation:** The system accurately generates valid, non-overlapping bookable slots within the user's availability.
* **Buffer Times:** Option to specify resting buffers (e.g., 15 mins) before and after events to naturally prevent consecutive meeting fatigue.
* **Custom Booking Questions:** Event types can outline a dynamic array of custom questions that guests are required to answer during checkout.
* **Atomic Rescheduling:** Comprehensive rescheduling flows backed by strict Prisma database transactions to prevent double-booking race conditions.
* **Email Notifications:** Automatic HTML-templated emails dispatched on booking confirmations, cancellations, and reschedules.
* **Premium Dark Theme:** A fully integrated, CSS-variable-based dark UI natively mimicking modern SaaS aesthetics.

## Assumptions Made

Due to the scoped nature of this task, the following assumptions were made regarding the system's edge cases:
* **Authentication is mocked:** There currently is no active local authentication system (JWT/OAuth). The application strictly assumes that `userId: 1` (`admin`) is the authenticated owner of the dashboard.
* **Timezone Defaulting:** The system heavily defaults to the `Asia/Kolkata` timezone for availability declarations to simplify complex cross-timezone parsing requirements.
* **Single Tenant Environment:** While the database models (`User` relationships) support multi-tenancy, the frontend routes and access patterns treat the system as a single-admin portal.

## Local Development Setup

To run this application locally on your machine, you must run both the backend and frontend servers simultaneously.

### Prerequisites
* Node.js v18 or higher
* npm or yarn
* An active PostgreSQL connection URL

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Set up your environment variables by creating a `.env` file based on the example:
```env
PORT=4000
DATABASE_URL="postgresql://user:password@host/dbname"

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM="Cal.com Clone <no-reply@cal.com>"
```
*(Note: If SMTP variables are left out, the backend will safely fallback to logging the email contents to the terminal instead of crashing).*

Push the schema to your database and generate the Prisma Client:
```bash
npx prisma db push
npx prisma generate
```

Seed the database with the default mock user (`userId: 1`):
```bash
npm run seed
```

Start the backend development server:
```bash
npm run dev
```
The backend should now be running on `http://localhost:4000`.

### 2. Frontend Setup

Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Configure your environment variables by creating a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Start the frontend development server:
```bash
npm run dev
```

### 3. Usage Guide

Once both servers are running:
1. Open your browser and navigate to `http://localhost:3000`.
2. Click "Go to app". Since you are the admin, you will be taken directly to the `/dashboard`.
3. Configure your **Availability** schedule and set any specific **Date Overrides**.
4. Create an **Event Type** (e.g., "15 Min Quick Chat") under the dashboard.
5. In the sidebar, click "View public page" or copy the public page link to grab your shareable URL ending in `/admin/15-min-quick-chat`.
6. Navigate to the copied URL as if you were a guest to see the available slots and submit a booking.
7. Return to the dashboard's **Bookings** layer to see your new engagement, cancel it, or test the rescheduling controls.

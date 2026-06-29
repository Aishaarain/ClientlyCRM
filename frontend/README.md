# Velora CRM Client

AI-powered CRM frontend for freelancers and agencies. Built with React, Vite, Tailwind CSS, Axios, React Router, Recharts, and optional React Three Fiber visuals.

## Features

- JWT auth with protected dashboard routes
- XD-inspired SaaS dashboard design
- Client, project, invoice, interaction, AI Studio, and risk pages
- Axios API layer mapped to the existing Express backend
- Streaming AI helpers for proposal/follow-up/insights endpoints
- Invoice PDF download support
- Responsive sidebar/topbar layout
- Reusable UI components
- Dashboard analytics with charts
- Optional Three.js animated auth visual

## Backend expected

The client expects the backend API at:

```bash
http://localhost:5001/api/v1
```

You can change this in `.env`:

```bash
VITE_API_URL=http://localhost:5001/api/v1
```

## Install and run

```bash
npm install
cp .env.example .env
npm run dev
```

Open:

```bash
http://localhost:5173
```

## Main routes

- `/login`
- `/register`
- `/dashboard`
- `/clients`
- `/clients/:id`
- `/projects`
- `/projects/:id`
- `/invoices`
- `/invoices/create`
- `/invoices/:id`
- `/interactions`
- `/ai/proposal`
- `/ai/follow-up`
- `/ai/insights`
- `/ai/content`
- `/risk`
- `/settings`

## Notes

Your backend currently does not expose single invoice GET by ID, so `InvoiceDetails.jsx` fetches invoices and finds the matching ID client-side. For a production version, add `GET /api/v1/invoices/:id`.

Your backend also does not scope records to the authenticated user yet. For production SaaS security, add ownership fields and ownership checks in backend controllers.

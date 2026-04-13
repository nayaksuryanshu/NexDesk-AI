# NexDesk AI

NexDesk AI is an AI-assisted customer support platform built to feel like a real hosted product. It combines ticketing, live chat, human handoff, and support analytics into one workspace so customers can get help quickly and support teams can stay organized.

The product is designed around a simple idea: keep the support flow clean, role-aware, and fast to use. Customers can open and follow tickets, while agents and admins can manage conversations, respond in real time, and review queue activity without unnecessary interface noise.

## Highlights

- AI-powered support chat with ticket history
- Role-based access for customer, agent, and admin sessions
- Live ticket handoff from AI to human support
- MongoDB-backed message and ticket storage
- Support queue, inbox, and analytics-style dashboards
- Responsive layout with a polished SaaS-style interface

## Product Areas

### Public site

- Marketing pages for product discovery
- Simple navigation and session-aware actions
- Login and registration flows

### Customer workspace

- Open support tickets
- View ticket history
- Continue AI conversations from saved chat sessions
- Track ongoing support requests

### Agent workspace

- Review active tickets and chat sessions
- Update ticket status
- Handle escalations and human handoffs
- Monitor support activity and queue state

### Analytics and operations

- Ticket queue overview
- Response and resolution visibility
- Operational dashboards for support teams

## Tech Stack

- Frontend: React 19, Vite, React Router, Axios, Socket.IO client
- Backend: Node.js, Express, Socket.IO
- Database: MongoDB with Mongoose
- Auth: JWT-based session handling
- AI and retrieval: Groq SDK, Xenova transformers, document parsing utilities
- Styling: Custom responsive CSS

## Repository Structure

- `Backend/` - API, data models, routes, controllers, sockets, services, and vector search utilities
- `Frontend/` - React app, pages, components, context, services, and styling
- `README.md` - Project overview and setup guide

## Prerequisites

- Node.js 18 or newer
- MongoDB connection string
- Frontend and backend environment variables

## Environment Setup

The repository includes example environment files:

- `Backend/.env.example`
- `Frontend/.env.example`

Create local `.env` files from those examples and fill in the values needed for your environment. Keep secret values out of Git.

Common backend variables include database, auth, vector search, and AI provider settings. The frontend usually needs only the API base URL when deployed outside local development.

## Local Development

### 1. Install dependencies

From the repository root, install dependencies in both apps:

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

### 2. Start the backend

Run the API from the backend folder:

```bash
cd Backend
npm run dev
```

The backend script runs `server.js` directly.

### 3. Start the frontend

Run the Vite dev server from the frontend folder:

```bash
cd Frontend
npm run dev
```

By default, Vite starts on `http://localhost:5173`.

## Available Scripts

### Backend

- `npm run start` - Start the backend server
- `npm run dev` - Start the backend server in development mode

### Frontend

- `npm run dev` - Start the Vite development server
- `npm run build` - Build the frontend for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build locally

## Main Features

### AI chat and ticket history

The chat experience stores conversations per ticket and reloads them when a ticket is reopened. This makes support sessions persistent instead of starting from scratch every time.

### Role-aware UI

The interface changes based on the logged-in role. Customers see customer actions, while agents and admins see operational tools such as ticket queues and dashboards.

### Human handoff

When a conversation needs escalation, the system can route it to a human agent while keeping context intact.

### Analytics and queue visibility

Support teams can view queue state, ticket trends, and resolution-focused information without leaving the app.

## Data and Architecture

- Tickets and messages are stored in MongoDB.
- The frontend loads saved ticket history before joining the realtime socket room.
- Socket.IO keeps chat and typing updates live.
- The app uses protected routes and JWT-based session restoration.

## Notes

- Do not commit `.env` files.
- Do not commit build output such as `Frontend/dist/`.
- Example environment files are safe to keep in the repository.
- The app is built to be responsive, but some operational screens are optimized for desktop workflows.

## Why This Project Exists

The goal of NexDesk AI is to make support feel calm, efficient, and production-ready. It is meant to behave like a real internal support platform: easy to use, visually clean, and organized around actual support work rather than a demo layout.

# 🎬 YouTube Watch Party

A real-time YouTube Watch Party application where users can create or join rooms and watch YouTube videos together in sync.

## Features

- Create and join watch party rooms
- Real-time video synchronization
- Host, Moderator and Participant roles
- Role management
- Remove users
- Transfer host privileges

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Socket.IO Client
- YouTube IFrame API

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB

## Installation

### Clone repository

```bash
git clone <repository-url>
cd WatchParty
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```
http://localhost:5173
```

Backend:

```
http://localhost:8000
```

## Live Demo

Frontend:
https://your-vercel-url.vercel.app

Backend:
https://your-render-url.onrender.com

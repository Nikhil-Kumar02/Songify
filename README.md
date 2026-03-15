# Songify 🎵

A professional, full-stack music streaming platform built with the MERN stack, Socket.io, and Clerk. Songify allows users to stream their favorite tracks, interact with friends in real-time, and discover new music through a sleek, Spotify-inspired interface.

## 🚀 Features

- **Real-time Social Interaction**: See what your friends are listening to in real-time and chat with them using Socket.io.
- **Dynamic Music Player**: Feature-rich audio player with queue management, play/pause, and track skipping.
- **Secure Authentication**: User management and authentication handled by Clerk.
- **Admin Dashboard**: Dedicated interface for managing the song and album library with Cloudinary for media storage.
- **Modern UI**: A responsive, dark-themed interface built with React, Tailwind CSS, and Shadcn UI components.
- **Latest Hits**: Integration with external APIs to discover the newest tracks.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Zustand, Lucide React, Clerk.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io.
- **Storage**: Cloudinary (Media assets).
- **Authentication**: Clerk.

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account
- Clerk account
- Cloudinary account

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Nikhil-Kumar02/Songify.git
   cd Songify
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

## 📄 License

This project is licensed under the ISC License.

---
Built with ❤️ by Nikhil Kumar

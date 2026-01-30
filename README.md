# GLC (Green Link Chain)

Node.js + Express + MongoDB app that serves a static frontend (HTML/CSS/JS) from the `frontend/` folder. It includes role-based authentication (farmer/shop/customer) and product/catalog flows backed by MongoDB.

> Note: This repository is not a React (MERN) client. The UI is plain HTML/JS served by Express.

## Tech Stack

- Backend: Node.js, Express
- Database: MongoDB (local or MongoDB Atlas)
- Sessions: `express-session`
- Uploads: `multer` (saved under `frontend/uploads/`)
- Frontend: Static pages in `frontend/`

## Prerequisites

- Node.js 18+ (recommended)
- MongoDB (local) **or** MongoDB Atlas connection string

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:

   - Copy `.env.example` to `.env`
   - Fill in at least `MONGO_URI`

   Example:

   ```env
   MONGO_URI=mongodb://127.0.0.1:27017
   DB_NAME=green_link
   PORT=3000
   SESSION_SECRET=change-me
   ```

   If you want `.env` to be loaded automatically, install dotenv:

   ```bash
   npm install dotenv
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Open the app:

- http://localhost:3000

The server hosts the static pages from `frontend/`.

## Project Structure

- `server.js` — Express server + API routes + MongoDB connection
- `frontend/` — Static HTML/CSS/JS pages
- `frontend/uploads/` — Uploaded images (ignored by git)

## Security Notes

- Do **not** commit `.env` files or credentials.
- Use a strong `SESSION_SECRET` in production.

## License

ISC (see `package.json`).

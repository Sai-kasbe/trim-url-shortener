# Trim - URL Shortener

A full-stack URL Shortener application built with React, Express.js, MongoDB, and Node.js.

## Features

* Create short URLs
* Custom aliases
* Redirect shortened URLs
* Click tracking
* Analytics dashboard
* Device breakdown analytics
* MongoDB persistence
* React frontend
* REST API backend

## Tech Stack

### Frontend

* React
* React Router
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Installation

### Backend

```bash
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## API Endpoints

### Create URL

POST

```text
/api/urls
```

Example:

```json
{
  "originalUrl": "https://github.com"
}
```

### Get All URLs

GET

```text
/api/urls
```

### Analytics

GET

```text
/api/urls/:shortCode/analytics
```

## Project Structure

```text
server/
├── client/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── pages/
└── README.md
```

## Testing

* Create short URLs
* Test redirects
* Verify analytics
* Verify click tracking
* Verify custom aliases

## Author

Kasbe Sai

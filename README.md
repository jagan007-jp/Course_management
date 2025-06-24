# Course Management System

A full-stack MERN (MongoDB, Express, React, Node.js) web application that allows users to explore, favorite, and get AI-generated learning roadmaps for various subjects. The project uses Chakra UI for a modern frontend and Redux for state management.

## Features

### User Authentication
- Users can register and log in with their own account.
- Username is stored globally using Redux and saved in `localStorage`.

### Course Management
- The home page lists all available courses.
- Users can add courses to their favourites.
- Favourites can be accessed from a separate favourites page.

### Roadmap Generator
- The Roadmap page allows users to input any subject.
- A learning roadmap is generated using **Gemini 1.5 Flash** (by Google DeepMind).

## Tech Stack

### Frontend
- React.js
- Chakra UI
- Redux Toolkit
- Fetch API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### AI Integration
- Roadmap generation powered by **Gemini 1.5 Flash (Google AI model)**

## Project Structure

### Backend
```
backend/
├── models/
│   ├── course.model.js
│   ├── fav.model.js
│   └── user.model.js
├── routes/
│   ├── course.route.js
│   ├── fav.route.js
│   ├── roadmap.route.js
│   └── user.route.js
│
└── .gitignore
```

### Frontend
```
frontend/
├── public/
├── src/
│   ├── pages/
│   │   ├── favourites.jsx
│   │   ├── home.jsx
│   │   ├── login.jsx
│   │   ├── navbar.jsx
│   │   ├── register.jsx
│   │   └── roadmap.jsx
│   ├── slice/
│   │   └── userSlice.js
│   ├── App.jsx
│   ├── main.jsx
│   └── store.js
│
└── index.html
```

## How to Run

1. Clone the repository:
   ```
   git clone https://github.com/jagan007-jp/Course_management.git
   ```

2. Install dependencies for both backend and frontend:
   ```
   cd backend
   npm install

   cd ../frontend
   npm install
   ```

3. Create a `.env` file in the backend directory and set your MongoDB URI and any necessary API keys.

4. Run the backend:
   ```
   cd backend
   npm start
   ```

5. Run the frontend:
   ```
   cd frontend
   npm run dev
   ```

## License
This is not licensed lol

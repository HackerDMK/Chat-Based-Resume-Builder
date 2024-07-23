# Chat Based Resume Builder - [Live Link](https://resume.hackerdmk.live)
Chat Based Resume Builder is a project that provides a chat interface for users to build and manage their resumes using AI. The project consists of a backend built with Express and Node.js, utilizing the [Anthropic API](https://www.anthropic.com/api), and a frontend built with React and Vite.js. Users can print their resumes or download them as DOCX files.

## Project Structure
```
backend/
frontend/
node_modules/
package.json
package-lock.json
```

### Backend
The backend is built with Express and Node.js. It handles API requests and interacts with the Anthropic API to provide the necessary functionality for the chat-based resume builder.

### Frontend
The frontend is built with React and Vite.js. It provides a user-friendly interface for interacting with the chat-based resume builder.

### Scripts
The project includes several scripts for building and running the application:

build: Installs all dependencies and builds both the backend and frontend.
start: Runs both the backend and frontend servers concurrently.

Script Definitions
```
"scripts": {
    "build:server": "cd backend && npm install",
    "build:client": "cd frontend && npm install",
    "build": "npm install && npm run build:server && npm run build:client",
    "start:server": "cd backend && nodemon server.js",
    "start:client": "cd frontend && npm run dev",
    "start": "concurrently \"npm run start:server\" \"npm run start:client\""
}
```

---

# Getting Started
To get started with the project, follow these steps:

### Clone the repository:

```
git clone git@github.com:HackerDMK/Chat-Based-Resume-Builder.git
cd Chat-Based-Resume-Builder
```

### Set up environment variables:

- For the backend, create a .env file from the provided env.example file in the backend directory.
- For the frontend, create a .env.development file from the provided .env.example file in the frontend directory.


#### Install dependencies:
```
npm run build
```

#### Start the application:
```
npm start
```
This will start both the backend and frontend servers. You can access the application at http://localhost:3000.

Contributing
If you'd like to contribute to this project, please fork the repository and use a feature branch. Pull requests are warmly welcome.

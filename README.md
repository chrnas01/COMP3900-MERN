# CSE Tutors MERN Application

This is our COMP3900 Major Project.

## Usage

Generally the .env files would be included in the .gitignore file to prevent it being viewed on github for security purposes. However for the sake of submission we have included it in our repository. The root .env files pertains to the backend, and the ./frontend .env file pertains to the frontend.

If either the backend or frontend server will not start, edit the pertaining ports in the .env files. If a frontend or backend port is changed, ensure that it is also changed in the other .env file for the equivalent port.

### Install dependencies

```
# Backend deps
npm install

# Frontend deps
cd frontend
npm install
```

### Run Server (Do not run in VSCode on Linux! Run in the local terminal)

```
# Start backend and frontend 
npm run dev

# Start backend
npm run server

# Start frontend
cd frontend
npm start
```

The frontend can be accessed at http://localhost:3005/

The backend can be accessed at http://localhost:5005/

# Northcoders News API

Link to Hosted Version - https://trevors-backend-js-project.onrender.com

Project Summary - This project is a test of what I can accomplish in backend in js

Getting Started
Ensure you have the following installed on your machine:
Node.js: Minimum version Node.js.14
PostgreSQL: Minimum version PostgreSQL.13

Installation
Clone the repository:
git clone https://github.com/TrevorRogers/Backend-js.git

You will need to create two .env files, .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment.

Install dependencies:
npm install -
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "fs": "^0.0.1-security",
    "pg": "^8.7.3",
    "promises": "^0.2.5",
    "supertest": "^7.0.0"

Set up the database:
Seed the database:
npm run seed

Running the Project
To start the project, run:
npm start

Running Tests
To run tests, use:
npm test
# Full-Stack Application (React, Node.js, Express, MySQL)

This is a full-stack application using the following technologies:

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MySQL

This README will guide you on how to set up and run the application locally.

## Prerequisites

Before getting started, make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14 or above)
- [MySQL](https://www.mysql.com/) (version 8 or above)
- [npm](https://www.npmjs.com/) (Node package manager)
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the Repository

Clone the repository to your local machine using the following command:<br>
git clone https://github.com/yourusername/2404.git

2. Set Up MySQL Database
You need to set up a MySQL database to store your data. Here's how:
    1. Log in to your MySQL server:<br>
        mysql -u root -p

    2. Create a new database in SQL:<br>
        CREATE DATABASE your_database_name;

    3. Ensure the .env file in the root directory of the project to store your MySQL connection details:<br>
        DB_HOST=localhost<br>
        DB_USER=root<br>
        DB_PASSWORD=yourpassword<br>
        DB_NAME=your_database_name

    *If you have any tables or schema to import, you can do it now (for example, by running a SQL script).

3. Backend Setup (Node.js with Express.js) <br>
   **Install Backend Dependencies** <br>
    Navigate to the backend directory and install the required dependencies:<br>
    cd backend<br>
    npm install<br>
    
    **Start the Backend Server** <br>
    After installing the dependencies, start the backend server:<br>
    npm start

    You should see the backend server will now be running at http://localhost:portnumberbackend.

4. Frontend Setup (React.js) <br>
    **Install Frontend Dependencies** <br>
    Navigate to the frontend directory and install the required dependencies:<br>
    cd ../frontend <br>
    npm install

    **Start the Frontend Server** <br>
    After installing the dependencies, start the frontend server: <br>
    npm start

    The frontend application will now be running at http://localhost:portnumberfrontend.

5. Testing the Application <br>
    Once both the frontend and backend servers are running, open your browser and navigate to http://localhost:portnumberfrontend. You should see the frontend application connected to the backend API, which in turn is connected to the MySQL database.

6. Common Issues and Troubleshooting <br>
    MySQL Connection Issues: Double-check that your .env file is set up correctly with the right database credentials.

    Port Conflicts: If the ports 3000 or 5000 are already in use, you can change them in the respective configuration files (package.json for React and server.js or app.js for Express).

    CORS Errors: If you encounter CORS issues, make sure the backend is set up to allow requests from the frontend. You can use the cors package in your Express backend: <br>
    npm install cors <br>
    
    Then, in app.js (or your Express setup file), add: <br>
    const cors = require('cors'); <br>
    app.use(cors());

## Project Structure
/fullstack-app
  /backend
    /node_modules
    /src
      app.js
      routes.js
      controllers
    package.json
  /frontend
    /node_modules
    /src
      /components
      /assets
    package.json
  .env
  README.md

/backend: Contains the backend Node.js/Express.js code.

/frontend: Contains the frontend React.js code.

.env: Stores environment variables like MySQL credentials.

Additional Notes
- You can extend this application by adding more routes, endpoints, and UI features.
- Don't forget to handle database migrations and manage your database schema properly.
- For deployment, consider using cloud services like Heroku, AWS, or DigitalOcean.

### Key Points:

- **Frontend** is running on port `3000`, and the **Backend** is running on port `3001` by default.
- The `README.md` assumes you have the MySQL database already set up and you're configuring the `.env` file for the database connection.
- It provides steps to clone the repo, install dependencies, set up the database, and start both the frontend and backend servers.
- There is troubleshooting advice for common issues like MySQL connection problems, port conflicts, and CORS errors.

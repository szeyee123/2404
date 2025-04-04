# Full-Stack Application (React, Node.js, Express, MySQL)

This is a full-stack application using the following technologies:

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MySQL

This README will guide you on how to set up and run the application locally.
Do note that the current application is only for SINGAPORE only!

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

3. Backend Setup (Node.js with Express.js) <br>
   **Install Backend Dependencies** <br>
    Navigate to the backend directory and install the required dependencies:<br>
    cd backend<br>
    npm install<br>
    
    **Start the Backend Server** <br>
    After installing the dependencies, start the backend server:<br>
    npm start

    You should see the backend server will now be running at http://localhost:[portnumberbackend].
    Below is the example:
    ![alt text](image-5.png)

    **Make sure to create the .env file under the server folder, ensure to edit the file to your PORT if it's different and make sure to generate your own encrypt key**
    To generate you own encrypt key, in your terminal:
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

    Copy that key and to replace "yourkey" with the generated key, also no quotations marks as well.

    Below should be expected, the port should be [portnumberbackend]:
    ![alt text](image-6.png)

4. Frontend Setup (React.js) <br>
    **Install Frontend Dependencies** <br>
    Navigate to the frontend directory and install the required dependencies:<br>
    cd ../frontend <br>
    npm install

    **Start the Frontend Server** <br>
    After installing the dependencies, start the frontend server: <br>
    npm start

    The frontend application will now be running at http://localhost:[portnumberfrontend].

    **Add a .env file inside the src folder with the following:**
    The port number should be from point 3, [portnumberbackend].
    ![alt text](image-4.png)

5. Signup to Onemap (https://www.onemap.gov.sg/apidocs/)
  This is so that you can get the token to ensure the address management system to work. Click on register and follow the instruction to get the token, then copy the token to the client/src/pages/Address/Address_form.jsx. See below of where to place your token, marked as [YourTokenHere].
  ![alt text](image.png)

  NOTE: Onemap only caters to SINGAPORE address only!

6. Testing the Application <br>
    Once both the frontend and backend servers are running, open your browser and navigate to http://localhost:portnumberfrontend. You should see the frontend application connected to the backend API, which in turn is connected to the MySQL database.

7. Common Issues and Troubleshooting <br>
    MySQL Connection Issues: Double-check that your .env file is set up correctly with the right database credentials.

    Port Conflicts: If the ports 3000 or 5000 are already in use, you can change them in the respective configuration files (package.json for React and server.js or app.js for Express).

    CORS Errors: If you encounter CORS issues, make sure the backend is set up to allow requests from the frontend. You can use the cors package in your Express backend: <br>
    npm install cors <br>
    
    Then, in app.js (or your Express setup file), add: <br>
    const cors = require('cors'); <br>
    app.use(cors());

## Project Structure
/fullstack-app<br>
  /backend<br>
    /node_modules<br>
    /src<br>
      app.js<br>
      routes.js<br>
      controllers<br>
    package.json<br>
  /frontend<br>
    /node_modules<br>
    /src<br>
      /components<br>
      /assets<br>
    package.json<br>
  .env<br>
  README.md<br>

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

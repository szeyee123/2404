===== Contribution ===== <br>
**Sze Yee**
Module: Admin User Management Dashboard

1. Backend Development (Express.js & MySQL)
- Designed a MySQL database schema with the users table, including fields: id, name, email, number, status (active or blocked), createdAt, updatedAt
- Developed APIs for:
	1. User CRUD operations
	2. Block/Unblock Users
	3. User Statistics
	4. Get longtitude and langtitude from address

2. Postman API Testing
- Created a Postman collection to test all API endpoints, covering:
	1. User CRUD operations and validation.
	2. Testing API responses with different status codes (200, 201, 400, 401, 404, 500).

3. Frontend Development (React.js, Axios, Chart.js & Leaflet.js)
- Built a React-based admin panel with:
	1. User Management Table – Displays users with actions to edit, delete, or block/unblock.
    2. Added address fields in
	3. Modal Forms – For updating user details.
	4. Dashboard with User Statistics.

4. Map Integration (Leaflet.js)
- Implemented Leaflet.js to visualize user locations:
	1. Used react-leaflet to embed an interactive map in the dashboard.
	2. Plotted user locations based on latitude/longitude from the database.
	3. Displayed markers with popups containing postcode.
	4. Allowed zoom and pan functionality to explore different user locations.

5. Dashboard & User Statistics (Chart.js)
- Created a real-time dashboard showing:
    1. Total Users Created This Month
    2. Total Users
    3. Recent Signups This Month
    4. Recent User Signups in a year
    5. Active vs Blocked
    6. Percentage of Active Users
    7. Singapore Map of where the default address of users


**Rianne Ong**<br>
Module: Address Management System

Key features and contributions:

~ CRUD Functionality ~
For backend, I implemented a backend system for handling CRUD operations on user addresses.
Created endpoints to add, update, retrieve, and delete addresses of a specific user.

For the frontend, I added validation to ensure that only one address can be set as the default per user. The form for adding or updating the address also has validation for the inputs and postal code lookup with validation. It also validates if there is a duplicate address and prompts user that they have a duplicate address.  

~ Default Address ~
For frontend, I implemented functionality to set one address as the default address, if the default address is deleted, it will prompt user to choose another address. If only one address, then user cannot delete them, a popup will show as "you cannot delete the default address without selecting another default".
![alt text](image-7.png)

Ensured that the system maintains a default address for users and prevents setting more than one default address at a time.
If user added or update another address and set it as default, it will call the function to change all the rest of the address to "false".

~ Encryption for Security ~
For the backend, I integrated encryption into the system using the crypto library to ensure that sensitive address data (e.g., street names, postcodes) is securely stored in the database.
Used symmetric encryption (AES) to encrypt address details before saving them to the database and decrypted them when retrieving the address for display.

~ Database Design ~
Designed and implemented the database schema, "addresses'' table to store addresses, ensuring that each address is linked to a specific user and can be easily retrieved or deleted. I also adjusted Sze Yee's "users" table by setting the userId as foreign key for my addresses, setting the userId as users "hasmany" addresses.

~ Postcode Lookup Integration: ~
Integrated a postcode lookup system using OpenMap API to auto-fill address fields based on the postcode input.
This feature was designed to make it easier for users to quickly input their address by leveraging postcode data.

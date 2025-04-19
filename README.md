# 🗂️ Asset Management System

A Node.js-based web application to manage assets, track issue/return history, 
and handle employee-user operations.

---

## 🚀 Features

- User authentication (admin & standard users)
- Asset CRUD operations
- Issue and return tracking
- PostgreSQL database with Sequelize ORM
- Clean UI with Bootstrap and DataTables

---

## 🧰 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (via Sequelize ORM)
- **Frontend:** Jade/Pug Templates, Bootstrap, DataTables
- **Auth:** Bcrypt (for password hashing)

---

## ⚙️ Setup Instructions

### 1. 📦 Install Required Packages

Open your project folder in **VS Code** and in the terminal run:
 
npm install

2. 🛢️ Setup PostgreSQL (via pgAdmin 4)
Open pgAdmin 4

Create a new database (e.g., asset_db)

Note down the following:

Database name

Username

Password

Host (usually localhost)

Port (usually 5432)

3. 🔐 Configure .env File
.env file in the root of your project and add the following:

env
 
DB_HOST=localhost
DB_PORT=5432
DB_NAME=asset_db
DB_USER=your_pg_user
DB_PASSWORD=your_pg_password

PORT=3000

4. 🏃‍♂️ Run the App
Start the app using this in terminal:

 
node app.js 

This will Sync all Sequelize models
and create the required tables

will Insert a default admin user:

Username: admin

Password: admin

5. 🌐 Open in Browser
Visit the app at:

http://localhost:3000/
Use the admin credentials to log in. After login, create additional users via the UI.


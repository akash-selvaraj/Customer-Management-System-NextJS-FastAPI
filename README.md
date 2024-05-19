# Customer Management System
![Typescript](https://github.com/akash-selvaraj/orbdoc_assesment/assets/81205378/e1a3765e-bbbe-44fb-91c2-e2db3c56614b)

## Overview
This project is a Next.js application integrated with a FastAPI backend. The system is designed to manage customer information including name, email, and favorite number, and store it in a MongoDB database. The application ensures unique customer entries using email as a unique key. It includes features for adding, editing, deleting, and viewing customers, along with sorting and search functionalities.

## Features
- **Add Customer**: Input customer name, email, and favorite number.
- **Edit Customer**: Update existing customer details.
- **Delete Customer**: Remove a customer from the database.
- **Prevent Duplicate Entries**: Ensure unique customer entries by using email as a key.
- **Sort**: Sort customers by clicking on table headers.
- **Search**: Search for customers by name, email, or favorite number.
- **Toggle Customer Status**: Activate or deactivate customers.
- **Notifications**: Toast messages for successful edits, deletions, and duplicate entry prevention.


## Prerequisites
- Node.js
- Python 3.8+
- MongoDB

## Installation

### Frontend
1. **Install Dependencies**
    ```bash
    npm install
    ```

2. **Build App**
    ```bash
    npm run build
    ```
3. **Run Server**
    ```bash
    npm start
    ```

### Backend
1. **Navigate to Backend Directory**
    ```bash
    cd backend
    ```

2. **Create and Activate Virtual Environment (Optional but recommended)**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

4. **Run FastAPI Server**
    ```bash
    uvicorn app:app --reload --host=0.0.0.0 --port=8000
    ```
### View app on browser
**Open**
    ```bash
    http://localhost:3000/
    ```
**in your Browser**
    
## Project Structure
```plaintext
project-root/
│
├── backend/
│   ├── app.py                # FastAPI application
│   ├── requirements.txt      # Backend dependencies
│   └── ...                   # Other backend files
│
├── src/
|   ├── app/
│   |	├── page.tsx              # Next.js main page
│   |	└── ...                  # Other Next.js pages
│   └── ...
├── .gitignore                # Git ignore file
├── package.json              # Frontend dependencies and scripts
├── README.md                 # Project documentation
└── ...                       # Other project files
```
## API Endpoints

### Get All Customers
- **URL**: `/customers`
- **Method**: `GET`
- **Response**: JSON array of all customers

### Add a Customer
- **URL**: `/customers`
- **Method**: `POST`
- **Body**: JSON object with `name`, `email`, and `favourite_number`
- **Response**: JSON object of the added customer or an error message if duplicate

### Edit a Customer
- **URL**: `/customers/{email}`
- **Method**: `PUT`
- **Body**: JSON object with updated `name` and `favourite_number`
- **Response**: JSON object of the updated customer or an error message

### Delete a Customer
- **URL**: `/customers/{email}`
- **Method**: `DELETE`
- **Response**: Success or error message

### Toggle Customer Status
- **URL**: `/customers/toggle/{email}`
- **Method**: `PUT`
- **Response**: JSON object of the customer with updated status or error message if not found
  
## Frontend Functionalities

### Adding a Customer
1. Fill out the customer form.
2. Click the "Add" button.
3. If the email is a duplicate, a toast message will notify you.

### Editing a Customer
1. Click the "Edit" button next to the customer you want to edit.
2. Modify the customer details.
3. Click "Save". A toast message will confirm the update.

### Deleting a Customer
1. Click the "Delete" button next to the customer you want to remove.
2. Confirm the deletion. A toast message will confirm the deletion.

### Sorting
- Click on the table headers to sort the customer list by the selected column.
  
### Searching
- Use the search bar to filter customers by name, email, or favorite number.

### Setting Customer Active/Inactive
- Use the toggle switch next to each customer to activate or deactivate them.
- A toast message will confirm the status change.


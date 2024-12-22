# 🚗 Car Management Application

A feature-rich Car Management Application that allows users to create, view, edit, and delete car entries. Each car entry includes up to **10 images**, a title, a description, and tags such as car type, company, and dealer. The application ensures **user authentication** and provides a **search functionality** across all products for seamless usability.

---

## 🌐 Live Demo

🔗 [Car Management Application](https://car-com-gp8z.vercel.app/login)

---

## ✨ Features

### 🔒 Core Functionalities
1. **User Authentication**
   - 🔑 Login and signup for secure access to the platform.

2. **Add Cars**
   - 🚘 Create car entries with the following details:
     - Up to **10 images**
     - **Title**
     - **Description**
     - **Tags** (e.g., car type, company, dealer)

3. **View Cars**
   - 👁️ View a list of all cars created by the user.
   - 🔍 Perform a **global search** to find cars by title, description, or tags.

4. **Car Details**
   - 📋 View detailed information about a specific car.
   - ✏️ Options to edit or delete the car.

5. **Edit Cars**
   - Update car details, including title, description, tags, and images.

6. **Delete Cars**
   - 🗑️ Remove any car entry created by the user.

---

## 🖥️ Frontend Pages
1. **Sign Up / Login Page**
   - User registration and login functionality.
2. **Product List Page**
   - Displays all cars created by the logged-in user with a search bar.
3. **Product Creation Page**
   - Form for uploading car images, setting a title, adding a description, and tags.
4. **Product Detail Page**
   - Displays detailed information about a car with options to edit or delete it.

---

## 📡 API Endpoints

1. **Create User**
   - Endpoint for user registration.
2. **Create Product**
   - Endpoint to add a new car.
3. **List Products**
   - Endpoint to fetch a list of all cars owned by the logged-in user.
4. **List Particular Product**
   - Endpoint to fetch details of a specific car.
5. **Update Product**
   - Endpoint to update car details.
6. **Delete Product**
   - Endpoint to delete a car.

---

## 💻 Technologies Used

### 🖥️ Frontend
- ⚛️ **React.js**
- 🎨 **CSS**
- 🌐 **HTML**
- 🎨 **TailwindCSS**

### 🌐 Backend
- ⚙️ **Node.js**
- 🧩 **Express.js**

### 🗄️ Database
- 🟢 **MongoDB**

---

## 🚀 Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kaifhb/Car.com.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd Car.com
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

5. **Start the development server:**
   ```bash
   npm start
   ```

6. **Access the application at:** `http://localhost:3000`

---

## 🔮 Future Enhancements

- 🎨 Enhance UI/UX for a modern and responsive design.
- 🔍 Add advanced search and filtering options.
- 🌐 Scale the application to support a larger user base.

---

## 📂 Repository

🔗 [GitHub Repository](https://github.com/kaifhb/Car.com)

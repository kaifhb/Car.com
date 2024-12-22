# Car Management Application

A feature-rich Car Management Application that allows users to create, view, edit, and delete car entries. Each car entry includes a maximum of 10 images, a title, a description, and tags such as car type, company, and dealer. The application also ensures user authentication and provides search functionality across products.

## Live Demo

[Car Management Application](https://car-com-gp8z.vercel.app/login)

## Features

### Core Functionalities
1. **User Authentication:** Users can log in or sign up to access the application.
2. **Add Cars:** Users can create car entries with the following details:
   - Up to 10 images
   - Title
   - Description
   - Tags (e.g., car type, company, dealer)
3. **View Cars:**
   - Users can view a list of all their cars.
   - Global search functionality allows users to search across all cars by title, description, or tags.
4. **Car Details:** Clicking on a car displays detailed information, including options to edit or delete the car.
5. **Edit Cars:** Users can update a car's title, description, tags, or images.
6. **Delete Cars:** Users can delete any car they own.

### Frontend Pages
1. **Sign Up / Login Page:** Enables user registration and login.
2. **Product List Page:** Displays all cars created by the logged-in user and includes a search bar.
3. **Product Creation Page:** Form for uploading car images, adding a title, description, and tags.
4. **Product Detail Page:** Displays detailed information about a car with options to edit or delete it.

## API Endpoints

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

## Technologies Used

### Frontend
- React.js
- CSS
- HTML
-TailwindCss

### Backend
- Node.js
- Express.js

### Database
- MongoDB

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/kaifhb/Car.com.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Car.com
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

5. Start the development server:
   ```bash
   npm start
   ```

6. Access the application at `http://localhost:3000`.

## Future Enhancements
- Improve UI/UX for better user experience.
- Add advanced search and filtering options.
- Implement a responsive design for better accessibility on mobile devices.
- Scale the application for broader usage.

## Repository

[GitHub Repository](https://github.com/kaifhb/Car.com)

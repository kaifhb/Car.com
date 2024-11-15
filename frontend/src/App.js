

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import CarList from './components/Cars/CarList';
import CarDetail from './components/Cars/CarDetail';
import CarForm from './components/Cars/CarForm';
import Navbar from './components/Layout/Navbar';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './components/NotFound';
import HomePage from './components/HomePage';

function App() {
  return (   
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/cars"
          element={
            <PrivateRoute>
              <CarList />
            </PrivateRoute>
          }
        />
        <Route
          path="/cars/new"
          element={
            <PrivateRoute>
              <CarForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/cars/:id"
          element={
            <PrivateRoute>
              <CarDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/cars/:id/edit"
          element={
            <PrivateRoute>
              <CarForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
 

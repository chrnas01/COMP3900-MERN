import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Register from './pages/Register'
import Login from './pages/Login'
import Homepage from './pages/Homepage'
import Recommend from './pages/Recommend'
import Dashboard from './pages/Dashboard'
import TutorProfile from './pages/TutorProfile'
import TutorProfileEdit from './pages/TutorProfileEdit'
import StuProfile from './pages/StuProfile'
import StuProfileEdit from './pages/StuProfileEdit'
import Chats from './pages/Chats';
import Courses from './pages/Courses';

const Router = () => {
  return (
    <Routes>
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/' element={<Homepage />} />
      <Route path='/recommend' element={<Recommend />} />
      <Route path='/courses' element={<Courses />} />
      <Route path='/:userId' element={<StuProfile />} />
      <Route path='/:userId/edit' element={<StuProfileEdit />} />
      <Route path='/tutor/:userId' element={<TutorProfile />} />
      <Route path='/tutor/:userId/edit' element={<TutorProfileEdit />} />
      <Route path='/chats' element={<Chats />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  );
}

export default Router;

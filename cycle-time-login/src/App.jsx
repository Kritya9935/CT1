import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './Login'
import Home from './Home'
import Admin  from './Admin'
import Home2 from './Home2'
import AdminDashboard from './AdminDashboard'
import AdminLogin from './AdminLogin'


function App() {
 

  return (
    <BrowserRouter>
      <Routes>
      
      <Route path='/' element={<Navigate to="/home2" />} />
      <Route path='/home2' element={<Home2/>}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/admin-login' element={<AdminLogin/>}></Route>
        <Route path='/home2' element={<Home2/>}></Route>
        <Route path='/admin' element={<Admin/>}></Route>
        <Route path='/admin-dashboard' element={<AdminDashboard/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

// mongodb+srv://Kashish:Cycle@cyclecluster.gx0yx.mongodb.net/?retryWrites=true&w=majority&appName=CycleCluster

import React from 'react'
import Home from "./components/modules/Home.jsx"
import { Routes, Route } from 'react-router-dom'
import Login from './components/modules/pages/Login.jsx'
import CourseDetail from './components/modules/pages/CourseDetail.jsx'
import AdminDashboard from './components/modules/pages/AdminDashboard.jsx'
import { ProtectedRoutes } from './components/ProtectedRoutes.jsx'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        
        <Route element={<ProtectedRoutes/>}>
          <Route path='/' element={<Home/>}/>
          <Route path='/cursos/:id' element={<CourseDetail/>}/>
          <Route path='/dashboard' element={<AdminDashboard/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App
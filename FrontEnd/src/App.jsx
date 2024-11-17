import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import CustomCursor from './components/CustomCursor'; // Adjust the path as necessary

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Navbar/>    
     <Outlet/>
    </>
  )
}

export default App

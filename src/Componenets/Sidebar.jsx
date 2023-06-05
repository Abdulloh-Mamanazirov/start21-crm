import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Groups, Home, Payment, Person, School, LibraryBooks, Newspaper, EmojiEvents, Campaign } from '@mui/icons-material'

const Sidebar = () => {
  let location = useLocation()
  
  return (
    <div className='min-h-screen p-3' style={{background:"rgb(14, 134, 233)"}}>
      <span className='text-center text-4xl font-bold mb-3 border-b-2 pb-3 flex items-center justify-center gap-2 text-white'><LibraryBooks sx={{fontSize:50}}/> CRM</span>
      <ul className='text-xl flex flex-col gap-3 font-medium'>
        <Link to="/" className={location.pathname === "/" ? "p-2 bg-sky-300 shadow-xl rounded-xl" : "p-2 text-white"}>
          <li className='flex items-center gap-3'><Home fontSize='medium'/> Dashboard</li>
        </Link>
        <Link to="/courses" className={location.pathname === "/courses" ? "p-2 bg-sky-300 shadow-xl rounded-xl" : "p-2 text-white"}>
          <li className='flex items-center gap-3'><Campaign fontSize='medium'/> Courses</li>
        </Link>
        <Link to="/teachers" className={location.pathname === "/teachers" ? "p-2 bg-sky-300 shadow-xl rounded-xl" : "p-2 text-white"}>
          <li className='flex items-center gap-3'><Person fontSize='medium'/> Teachers</li>
        </Link>
        <Link to="/groups" className={location.pathname === "/groups" ? "p-2 bg-sky-300 shadow-xl rounded-xl" : "p-2 text-white"}>
          <li className='flex items-center gap-3'><Groups fontSize='medium'/> Groups</li>
        </Link>
        <Link to="/students" className={location.pathname === "/students" ? "p-2 bg-sky-300 shadow-xl rounded-xl" : "p-2 text-white"}>
          <li className='flex items-center gap-3'><School fontSize='medium'/> Students</li>
        </Link>
        {/* <Link to="/news" className={location.pathname === "/news" ? "p-2 bg-sky-300 shadow-xl rounded-xl" : "p-2 text-white"}>
          <li className='flex items-center gap-3'><Newspaper fontSize='medium'/> News</li>
        </Link>
        <Link to="/results" className={location.pathname === "/results" ? "p-2 bg-sky-300 shadow-xl rounded-xl" : "p-2 text-white"}>
          <li className='flex items-center gap-3'><EmojiEvents fontSize='medium'/> Results</li>
        </Link> */}
        {/* <Link to="/payment" className={location.pathname === "/payment" ? "p-2 bg-sky-300 shadow-xl rounded-xl" : "p-2 text-white"}>
          <li className='flex items-center gap-3'><Payment fontSize='medium'/> Payment</li>
        </Link> */}
      </ul>
    </div>
  )
}

export default Sidebar

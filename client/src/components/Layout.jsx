import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Topbar'

const Layout = ({children}) => {
  return (
    <div className='flex h-screen'>
      <Sidebar/>
      <div className='flex-1 flex flex-col'>
        <Navbar/>
        <div className='p-6 bg-white flex-1 overflow-y-auto'>
            {children}
        </div>
      </div>
    </div>
  )
}

export default Layout

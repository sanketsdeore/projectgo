import React from 'react'
import { Link } from 'react-router-dom'
import { OrganizationSwitcher, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

const Navbar = () => {
  return (
    <nav className='flex justify-between items-center px-6 py-4 bg-white border-b'>
      <input
        type="text"
        placeholder='Search projects, tasks...'
        className='w-1/3 px-4 py-2 mx-6 rounded-xl outline-none border border-gray-300 focus:ring-2 focus:ring-sky-200'
      />
      <div className='flex items-center mr-8 gap-8'>
        <OrganizationSwitcher />
        <div className="w-10 h-10 flex-shrink-0">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10 rounded-full border border-gray-300"
              }
            }}
          />
        </div>
      </div>
    </nav>
  )
}

export default Navbar

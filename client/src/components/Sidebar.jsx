import React from 'react'
import { MdOutlineSpaceDashboard, MdOutlineSettings } from 'react-icons/md'
import { FaRegFolderOpen } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { Link, useLocation } from 'react-router-dom';


const Sidebar = () => {
    const location = useLocation()
    const menu = [
        { name: "Dashboard", path: "/dashboard", icon: <MdOutlineSpaceDashboard /> },
        { name: "Projects", path: "/projects", icon: <FaRegFolderOpen /> },
        { name: "Team", path: "/team", icon: <FiUsers /> },
        { name: "Settings", path: "/settings", icon: <MdOutlineSettings /> }
    ]
    return (
        <div className='w-64 bg-white border-r p-4 flex flex-col'>
            <img 
            src="/projectgo_logo.png" 
            alt="logo" 
            className='w-full mb-6 pb-2 border-b'
            />
            <div className='space-y-4'>
                {menu.map((item) => {
                    const isActive = location.pathname === item.path

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${isActive
                                    ? "bg-sky-100 text-sky-600"
                                    : "hover:bg-gray-100"
                                }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default Sidebar

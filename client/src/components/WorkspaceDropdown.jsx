import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useUser, CreateOrganization } from '@clerk/clerk-react';

const WorkspaceDropdown = () => {
    const [open, setOpen] = useState(false);
    const [workspaces, setWorkspaces] = useState([]);
    const [current, setCurrent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const dropdownRef = useRef();

    const { user } = useUser;

    const userId = user?.id;

    useEffect(() => {
        const fetchWorkspaces = async () => {
            const res = await axios.get(
                `http://localhost:5000/api/workspaces/${userId}`
            );
            setWorkspaces(res.data);

            if (res.data.length === 0) {
                setShowModal(true);
            }
            else setCurrent(res.data[0]);
        };
        fetchWorkspaces();
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (!dropdownRef.current?.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        if (current) {
            localStorage.setItem("workspaceId", current._id);
        }
    }, [current]);


    return (
        <div className="relative" ref={dropdownRef}>

            <div
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100"
            >
                <div className="w-8 h-8 bg-sky-600 text-white flex items-center justify-center rounded">
                    {current?.name?.charAt(0)}
                </div>

                <div className="text-sm">
                    <p className="font-medium">{current?.name}</p>
                    <p className="text-gray-500 text-xs">1 workspace</p>
                </div>
            </div>

            {open && (
                <div className="absolute mt-2 w-64 bg-white border rounded-lg shadow-md z-50">

                    <p className="text-xs text-gray-500 px-4 py-2">
                        WORKSPACES
                    </p>

                    {workspaces.map((ws) => (
                        <div
                            key={ws._id}
                            onClick={() => {
                                setCurrent(ws);
                                setOpen(false);
                            }}
                            className="flex justify-between items-center px-4 py-3 hover:bg-gray-100 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-sky-600 text-white flex items-center justify-center rounded">
                                    {ws.name.charAt(0)}
                                </div>

                                <div>
                                    <p className="text-sm font-medium">{ws.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {ws.members.length} members
                                    </p>
                                </div>
                            </div>

                            {current?._id === ws._id && (
                                <span className="text-blue-500">✔</span>
                            )}
                        </div>
                    ))}

                    <div
                        className="px-4 py-3 text-blue-600 hover:bg-gray-100 cursor-pointer border-t"
                        onClick={() => {
                            setShowModal(true);
                        }}
                    >
                        + Create Workspace
                    </div>
                    {showModal && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl p-4">
                                <CreateOrganization />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default WorkspaceDropdown

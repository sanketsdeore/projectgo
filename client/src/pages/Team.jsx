import React, { useState } from 'react'
import InviteModal from '../components/InviteModal'
import { useOrganization } from '@clerk/clerk-react'

const Team = () => {
    const [showModal, setShowModal] = useState(false)

    const [search, setSearch] = useState("")

    const { organization, isLoaded, memberships } = useOrganization({
        memberships: true,
    });

    if (!isLoaded) return <p>Loading...</p>

    const members = memberships.data || []

    const { membership } = useOrganization();

    const role = membership?.role;

    const isAdmin = role === "org:admin";

    const filteredMembers = members.filter((member) => {
        const user = member.publicUserData;

        const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();

        const email = (user.identifier || "").toLowerCase();

        return (
            fullName.includes(search.toLowerCase()) ||
            email.includes(search.toLowerCase())
        );
    });

    return (
        <div className='mr-6'>
            <div className='flex justify-between items-center'>
                <div>
                    <h1 className='text-2xl font-bold'>Team</h1>
                    <p className='text-gray-500 text-sm py-1'>Manage team members and their contributions</p>
                </div>

                {isAdmin && (
                    <button
                        className='bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition'
                        onClick={() => setShowModal(true)}
                    >
                        + Invite Member
                    </button>
                )}
            </div>
            {showModal && (
                <InviteModal onClose={() => setShowModal(false)} />
            )}
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search team members...'
                className='w-full mt-4 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-sky-200'
            />

            <div className='mt-6 border rounded-xl overflow-hidden'>

                <div className='grid grid-cols-3 bg-gray-50 p-4 font-semibold text-sm'>
                    <span>Name</span>
                    <span>Email</span>
                    <span>Role</span>
                </div>

                {filteredMembers
                    .slice()
                    .sort((a, b) => {
                        if (a.role === "org:admin" && b.role !== "org:admin") return -1
                        if (a.role !== "org:admin" && b.role === "org:admin") return 1
                        return 0
                    }).map((member) => {
                        const user = member.publicUserData

                        return (
                            <div
                                key={member.id}
                                className='grid grid-cols-3 p-4 items-center border-t hover:bg-gray-50'
                            >
                                <div className='flex items-center gap-3'>
                                    <img
                                        src={user.imageUrl}
                                        alt="avatar"
                                        className='w-8 h-8 rounded-full'
                                    />
                                    <span>{user.firstName} {user.lastName}</span>
                                </div>

                                <span className='text-gray-600'>
                                    {user.identifier}
                                </span>

                                <span
                                    className={`text-xs px-3 py-1 rounded w-fit ${member.role === "org:admin"
                                        ? "bg-purple-100 text-purple-600"
                                        : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {member.role === "org:admin" ? "ADMIN" : "MEMBER"}
                                </span>
                            </div>
                        )
                    })}

            </div>
        </div>
    )
}

export default Team

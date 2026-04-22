import { useOrganization } from '@clerk/clerk-react'
import React, { useState } from 'react'

const InviteModal = ({ onClose }) => {
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("Member")
    const [loading, setLoading] = useState(false)

    const { organization } = useOrganization();

    const handleInvite = async () => {
        if (!email.trim()) return;
        try {
            setLoading(true)

            await organization?.inviteMember({
                emailAddress: email,
                role: role === "Admin" ? "org:admin" : "org:member"
            });
            onClose()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[400px] p-6 rounded-xl shadow-lg">

                <h2 className="text-xl font-semibold mb-4">
                    Invite Team Member
                </h2>

                <div className="mb-4">
                    <label className="text-sm text-gray-600">
                        Email Address
                    </label>
                    <input
                        type="email"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="mb-6">
                    <label className="text-sm text-gray-600">
                        Role
                    </label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option>Member</option>
                        <option>Admin</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md"
                    >
                        Cancel
                    </button>

                    <button
                        className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600"
                        onClick={() => handleInvite()}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Invitation"}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default InviteModal
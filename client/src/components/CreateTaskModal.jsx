import { useOrganization } from '@clerk/clerk-react'
import React, { useState } from 'react'

const CreateTaskModal = ({ onClose, onCreate }) => {
    const [form, setForm] = useState({
        title: "",
        type: "Feature",
        priority: "Medium",
        status: "Todo",
        assignee: "",
        dueDate: "",
    })

    const handleSubmit = () => {
        if (!form.title.trim()) return

        onCreate({
            ...form,
            assignee: form.assignee || null
        })
        onClose()
    }

    const { organization, isLoaded, memberships } = useOrganization({
        memberships: true,
    });
    if (!isLoaded) return <p>Loading...</p>

    const members = memberships.data || []

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[500px] rounded-xl shadow-lg p-6 relative">

                <h2 className="text-xl font-semibold mb-5">
                    Create New Task
                </h2>

                <div className="space-y-4">

                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Title
                        </label>
                        <input
                            placeholder="Task title"
                            className="w-full mt-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Description
                        </label>
                        <textarea
                            placeholder="Describe the task"
                            className="w-full mt-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                            value={form.description || ""}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="w-1/2">
                            <label className="text-sm font-medium text-gray-600">
                                Type
                            </label>
                            <select
                                className="w-full mt-1 px-3 py-2 border rounded-md"
                                value={form.type}
                                onChange={(e) =>
                                    setForm({ ...form, type: e.target.value })
                                }
                            >
                                <option>Task</option>
                                <option>Feature</option>
                                <option>Bug</option>
                            </select>
                        </div>

                        <div className="w-1/2">
                            <label className="text-sm font-medium text-gray-600">
                                Priority
                            </label>
                            <select
                                className="w-full mt-1 px-3 py-2 border rounded-md"
                                value={form.priority}
                                onChange={(e) =>
                                    setForm({ ...form, priority: e.target.value })
                                }
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="w-1/2">
                            <label className="text-sm font-medium text-gray-600">
                                Assignee
                            </label>
                            <select
                                className="w-full mt-1 px-3 py-2 border rounded-md"
                                value={form.assignee}
                                onChange={(e) =>
                                    setForm({ ...form, assignee: e.target.value })
                                }
                            >
                                <option value="">Unassigned</option>
                                {members.map((member) => {
                                    const user = member.publicUserData;

                                    return (
                                        <option key={user.userId} value={user.userId}>
                                            {user.firstName} {user.lastName}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>

                        <div className="w-1/2">
                            <label className="text-sm font-medium text-gray-600">
                                Status
                            </label>
                            <select
                                className="w-full mt-1 px-3 py-2 border rounded-md"
                                value={form.status}
                                onChange={(e) =>
                                    setForm({ ...form, status: e.target.value })
                                }
                            >
                                <option>Todo</option>
                                <option>In Progress</option>
                                <option>Done</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Due Date
                        </label>
                        <input
                            type="date"
                            className="w-full mt-1 px-3 py-2 border rounded-md"
                            value={form.dueDate}
                            onChange={(e) =>
                                setForm({ ...form, dueDate: e.target.value })
                            }
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition"
                        >
                            Create Task
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CreateTaskModal

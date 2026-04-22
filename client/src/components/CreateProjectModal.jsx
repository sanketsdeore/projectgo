import React, { useState } from 'react'

const CreateProjectModal = ({ onClose, onCreate }) => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        status: "Planning",
        priority: "Medium",
        progress: 0,
        startDate: "",
        endDate: ""
    })

    const handleSubmit = () => {
        if (!form.name.trim()) return

        onCreate(form)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[480px] rounded-xl shadow-lg p-6 relative">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold mb-1">Create New Project</h2>
                <p className="text-sm text-gray-500 mb-5">Fill details below</p>

                <div className="space-y-4">

                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Project Name
                        </label>
                        <input
                            placeholder="Enter project name"
                            className="w-full mt-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Description
                        </label>
                        <textarea
                            placeholder="Describe your project"
                            className="w-full mt-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />
                    </div>

                    <div className="flex gap-3">
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
                                <option>Planning</option>
                                <option>Active</option>
                                <option>Completed</option>
                                <option>On Hold</option>
                                <option>Cancelled</option>
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
                                Start Date
                            </label>
                            <input
                                type="date"
                                className="w-full mt-1 px-3 py-2 border rounded-md"
                                value={form.startDate}
                                onChange={(e) =>
                                    setForm({ ...form, startDate: e.target.value })
                                }
                            />
                        </div>

                        <div className="w-1/2">
                            <label className="text-sm font-medium text-gray-600">
                                End Date
                            </label>
                            <input
                                type="date"
                                className="w-full mt-1 px-3 py-2 border rounded-md"
                                value={form.endDate}
                                onChange={(e) =>
                                    setForm({ ...form, endDate: e.target.value })
                                }
                            />
                        </div>
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
                            Create Project
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CreateProjectModal

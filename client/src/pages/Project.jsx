import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { IoMdArrowBack } from "react-icons/io";
import CreateTaskModal from '../components/CreateTaskModal';
import axios from "axios"
import { useEffect } from "react"
import { useOrganization } from '@clerk/clerk-react';
import InviteModal from '../components/InviteModal';
import TaskCalendar from '../components/TaskCalendar';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const Project = () => {
  const { id } = useParams()
  const [tasks, setTasks] = useState([])

  const { membership } = useOrganization();

  const role = membership?.role;

  const isAdmin = role === "org:admin";

  const [filters, setFilters] = useState({
    status: "All Statuses",
    type: "All Types",
    priority: "All Priorities",
    assignee: "",
  })

  const filteredTasks = tasks.filter((task) => {
    return (
      (filters.status === "All Statuses" || task.status === filters.status) &&
      (filters.type === "All Types" || task.type === filters.type) &&
      (filters.priority === "All Priorities" || task.priority === filters.priority) &&
      (
        filters.assignee === "unassigned"
          ? !task.assignee
          : !filters.assignee || task.assignee === filters.assignee
      )

    )
  })

  const totalTasks = tasks.length

  const completedTasks = tasks.filter((t) =>
    t.status === "Done"
  ).length

  const inProgressTasks = tasks.filter((t) =>
    t.status === "In Progress"
  ).length

  const teamMembers = new Set(
    tasks.map((t) => t.assignee)
  ).size

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/tasks/${id}`
        )
        setTasks(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchTasks()
  }, [id])

  const handleAddTask = async (taskData) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/tasks",
        {
          ...taskData,
          projectId: id,
          orgId: organization?.id
        }
      )

      setTasks((prev) => [...prev, res.data])

    } catch (err) {
      console.error("Error creating task:", err)
    }
  }

  const [showModal, setShowModal] = useState(false)

  const { organization, isLoaded, memberships } = useOrganization({
    memberships: true,
  });

  if (!isLoaded) return <p>Loading...</p>

  const members = memberships.data || []

  const [showTaskModal, setShowTaskModal] = useState(false)

  const [activeTab, setActiveTab] = useState("tasks")

  const [project, setProject] = useState(null)

  const [form, setForm] = useState(null)

  useEffect(() => {
    if (project) {
      setForm(project)
    }
  }, [project])

  const handleUpdateProject = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/projects/${id}`,
        form
      )
      setProject(res.data)
      alert("Project updated")
    } catch (err) {
      console.error("Update failed:", err)
    }
  }

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/projects/${id}`
        )
        setProject(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchProject()
  }, [id])

  const getAssigneeName = (assigneeId) => {
    const member = members.find(
      (m) => m.publicUserData.userId === assigneeId
    );

    if (!member) return "Unassigned";

    const user = member.publicUserData;
    return `${user.firstName} ${user.lastName}`;
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "Done").length;
  const active = tasks.filter(t => t.status !== "Done").length;
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  const overdue = tasks.filter(t =>
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "Done"
  ).length;

  const completionRate = total
    ? Math.round((completed / total) * 100)
    : 0;

  const statusData = {
    Todo: tasks.filter(t => t.status === "Todo").length,
    "In Progress": tasks.filter(t => t.status === "In Progress").length,
    Done: tasks.filter(t => t.status === "Done").length,
  };

  const typeData = tasks.reduce((acc, task) => {
    acc[task.type] = (acc[task.type] || 0) + 1;
    return acc;
  }, {});

  const priorityData = {
    Low: tasks.filter(t => t.priority === "Low").length,
    Medium: tasks.filter(t => t.priority === "Medium").length,
    High: tasks.filter(t => t.priority === "High").length,
  };

  const statusChart = Object.keys(statusData).map(key => ({
    name: key,
    value: statusData[key]
  }));

  const typeChart = Object.keys(typeData).map(key => ({
    name: key,
    value: typeData[key]
  }));

  return (
    <div className='mr-6'>

      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => window.history.back()}
            className='text-gray-500 text-lg hover:text-black'
          >
            <IoMdArrowBack />
          </button>
          <h1 className='text-xl ml-2 font-semibold'>
            {project?.name || "Loading..."}
          </h1>
          <span
            className={`text-sm px-2 py-1 rounded ${project?.status === "Active"
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-600"
              }`}
          >
            {project?.status || "Loading"}
          </span>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowTaskModal(true)}
            className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600 cursor-pointer"
          >
            + New Task
          </button>
        )}
      </div>

      {showTaskModal && (
        <CreateTaskModal
          onClose={() => setShowTaskModal(false)}
          onCreate={handleAddTask}
        />
      )}

      <div className="grid grid-cols-4 gap-4 mt-6">

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <h2 className="text-2xl font-bold">{totalTasks}</h2>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Completed</p>
          <h2 className="text-2xl font-bold text-green-600">
            {completedTasks}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">In Progress</p>
          <h2 className="text-2xl font-bold text-orange-500">
            {inProgressTasks}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Team Members</p>
          <h2 className="text-2xl font-bold text-blue-500">
            {teamMembers}
          </h2>
        </div>
      </div>

      <div className='flex gap-1 bg-sky-50 p-1 rounded-lg w-fit mt-6'>
        {[
          { key: "tasks", label: "Tasks" },
          { key: "calendar", label: "Calendar" },
          { key: "analytics", label: "Analytics" },
          { key: "settings", label: "Settings" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1 text-sm rounded-md transition ${activeTab === tab.key
              ? "bg-white shadow-sm font-medium"
              : "text-gray-500 hover:text-black"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "tasks" && (
        <div>
          <div className="flex gap-3 mt-4">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="border px-2 py-1 text-sm rounded"
            >
              <option>All Statuses</option>
              <option>Todo</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) =>
                setFilters({ ...filters, type: e.target.value })
              }
              className="border px-2 py-1 text-sm rounded"
            >
              <option>All Types</option>
              <option>Task</option>
              <option>Feature</option>
              <option>Bug</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
              className="border px-2 py-1 text-sm rounded"
            >
              <option>All Priorities</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <select
              value={filters.assignee}
              onChange={(e) =>
                setFilters({ ...filters, assignee: e.target.value })
              }
              className="border px-2 py-1 text-sm rounded"
            >
              <option value="">All Assignees</option>
              <option value="unassigned">Unassigned</option>

              {members.map((member) => {
                const user = member.publicUserData;

                const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

                return (
                  <option key={member.id} value={user.userId}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className='bg-white rounded-lg shadow-sm overflow-hidden mt-6 border'>
            <div className='grid grid-cols-6 p-4 text-sm font-medium text-gray-500 border-b'>
              <span>Title</span>
              <span>Type</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Assignee</span>
              <span>Due Date</span>
            </div>
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className='grid grid-cols-6 p-4 items-center border-b hover:bg-gray-50'
              >
                <span className='font-medium'>{task.title}</span>
                <span className='text-sm'>{task.type}</span>
                <span
                  className={`text-sm px-2 py-1 rounded w-24 h-7 ${task.priority === "High"
                    ? "bg-red-100 text-red-600"
                    : task.priority === "Medium"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {task.priority}
                </span>
                <select
                  disabled={!isAdmin}
                  value={task.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value

                    try {
                      const res = await axios.put(
                        `http://localhost:5000/api/tasks/${task._id}`,
                        { status: newStatus }
                      )

                      setTasks((prev) =>
                        prev.map((t) =>
                          t._id === task._id ? res.data : t
                        )
                      )
                    } catch (err) {
                      console.error("Error updating status:", err)
                    }
                  }}
                  className="text-sm border rounded w-28 border-none px-2 py-1"
                >
                  <option>Todo</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>
                <span className='text-sm flex items-center gap-2'>{getAssigneeName(task.assignee)}</span>
                <span className='text-sm text-gray-500'>{task.dueDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="grid grid-cols-3 gap-6 mt-6">

          <div className="col-span-2 bg-white p-6 rounded-xl border shadow-sm">

            <h2 className="text-lg font-semibold mb-5">
              Project Details
            </h2>

            <div className="mb-4">
              <label className="text-sm text-gray-600">Project Name</label>
              <input
                value={form?.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-600">Description</label>
              <textarea
                value={form?.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-md h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <select
                  value={form?.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                >
                  <option>Planning</option>
                  <option>Active</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Priority</label>
                <select
                  value={form?.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-600">Start Date</label>
                <input
                  type="date"
                  value={form?.startDate?.slice(0, 10) || ""}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">End Date</label>
                <input
                  type="date"
                  value={form?.endDate?.slice(0, 10) || ""}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="text-sm text-gray-600">
                Progress: {form?.progress || 0}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step={5}
                value={form?.progress || 0}
                onChange={(e) =>
                  setForm({ ...form, progress: e.target.value })
                }
                className="w-full mt-2 accent-sky-500 bg-sky-300"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleUpdateProject}
                className="bg-sky-500 text-white px-5 py-2 rounded-md hover:bg-sky-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border shadow-sm h-fit">

            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">
                Team Members
              </h2>

              {isAdmin && (
                <button
                  className="border px-2 pb-1 rounded hover:bg-gray-100"
                  onClick={() => setShowModal(true)}
                >
                  +
                </button>
              )}
            </div>
            {showModal && (
              <InviteModal onClose={() => setShowModal(false)} />
            )}

            {members
              .slice()
              .sort((a, b) => {
                if (a.role === "org:admin" && b.role !== "org:admin") return -1
                if (a.role !== "org:admin" && b.role === "org:admin") return 1
                return 0
              }).map((member) => {
                const user = member.publicUserData

                return (
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700 pb-1">
                      {user.identifier}
                    </p>

                    {member.role === "org:admin" &&
                      (
                        <span className="text-xs px-2 py-1 border rounded">
                          Admin
                        </span>
                      )
                    }
                  </div>
                )
              })}
          </div>

        </div>
      )}
      {activeTab === "calendar" && (
        <TaskCalendar tasks={tasks} />
      )}
      {activeTab === "analytics" && (
        <div className="mt-6 space-y-6">

          <div className="grid grid-cols-4 gap-4">

            <div className="bg-white p-4 rounded border">
              <p className="text-sm text-gray-500">Completion Rate</p>
              <h2 className="text-2xl font-bold text-green-600">{completionRate}%</h2>
            </div>

            <div className="bg-white p-4 rounded border">
              <p className="text-sm text-gray-500">Active Tasks</p>
              <h2 className="text-2xl font-bold text-blue-600">{active}</h2>
            </div>

            <div className="bg-white p-4 rounded border">
              <p className="text-sm text-gray-500">Overdue Tasks</p>
              <h2 className="text-2xl font-bold text-red-600">{overdue}</h2>
            </div>

            <div className="bg-white p-4 rounded border">
              <p className="text-sm text-gray-500">Team Size</p>
              <h2 className="text-2xl font-bold text-purple-600">{members.length}</h2>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-6">

            <div className="bg-white p-4 rounded border">
              <h2 className="font-semibold mb-3">Tasks by Status</h2>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={statusChart}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />

                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {statusChart.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name === "Todo"
                            ? "#9CA3AF"
                            : entry.name === "In Progress"
                              ? "#3B82F6"
                              : "#10B981"
                        }
                      />
                    ))}
                  </Bar>

                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded border">
              <h2 className="font-semibold mb-3">Tasks by Type</h2>

              <PieChart width="100%" height={250}>
                <Pie
                  data={typeChart}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {typeChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

          </div>

          <div className="bg-white p-4 rounded border">
            <h2 className="font-semibold mb-3">Tasks by Priority</h2>

            {Object.keys(priorityData).map((key) => (
              <div key={key} className="mb-2">
                <div className="flex justify-between text-sm">
                  <span>{key}</span>
                  <span>{priorityData[key]} tasks</span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded mt-1">
                  <div
                    className={`h-2 rounded ${key === "High"
                      ? "bg-red-500"
                      : key === "Medium"
                        ? "bg-blue-500"
                        : "bg-gray-400"
                      }`}
                    style={{
                      width: total
                        ? `${(priorityData[key] / total) * 100}%`
                        : "0%"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  )
}

export default Project

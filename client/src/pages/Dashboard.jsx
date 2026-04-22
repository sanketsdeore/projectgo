import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useOrganization, useUser } from '@clerk/clerk-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const { organization } = useOrganization();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projRes = await axios.get("http://localhost:5000/api/projects", {
          params: { orgId: organization?.id }
        });

        const taskRes = await axios.get("http://localhost:5000/api/tasks", {
          params: { orgId: organization?.id }
        });

        setProjects(projRes.data);
        setTasks(taskRes.data);


      } catch (err) {
        console.error(err);
      }
    };

    if (organization?.id) fetchData();
  }, [organization]);

  const recentProjects = projects.slice(0, 4);

  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === "Completed").length;

  const { user } = useUser();
  const myTasks = tasks.filter(
    t => t.assignee === user?.id
  ).length;

  const overdue = tasks.filter(t =>
    t.dueDate && new Date(t.dueDate) < new Date() && t.status != "Done"
  ).length;

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects,
      subtitle: "projects in workspace",
    },
    {
      title: "Completed Projects",
      value: completedProjects,
      subtitle: "of total",
    },
    {
      title: "My Tasks",
      value: myTasks,
      subtitle: "assigned to me",
    },
    {
      title: "Overdue",
      value: overdue,
      subtitle: "need attention",
    },
  ]

  return (
    <div className='mr-6'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Dashboard</h1>
          <p className='text-gray-500 text-sm py-1'>Here's what's happening with your projects today</p>
        </div>
      </div>

      <div className='grid grid-cols-4 gap-4 md-6'>
        {stats.map((stat, index) => (
          <div
            key={index}
            className='bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition'
          >
            <h3 className='text-gray-500 text-sm pb-1'>{stat.title}</h3>
            <p className='text-2xl font-bold pb-1'>{stat.value}</p>
            <p className='text-xs text-gray-400'>{stat.subtitle}</p>
          </div>
        ))}
      </div>

      <div className='grid my-4 grid-cols-3 gap-6'>
        <div className='col-span-2 rounded-lg border p-4'>
          <h2 className='text-lg font-semibold mb-4 border-b pb-4'>Project Overview</h2>
          <div className='space-y-3'>
            {recentProjects.map((project) => (
              <div
                key={project._id}
                className='flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer'
                onClick={() => navigate(`/project/${project._id}`)}
              >
                <div>
                  <h3 className='text-sm font-semibold'>{project.name}</h3>
                  <p className='text-sm text-gray-500'>
                    {tasks.filter(t => String(t.projectId) === String(project._id)).length} tasks
                  </p>
                </div>
                <span className={`text-sm font-semibold mr-4 ${project.status === "Completed"
                  ? "text-green-600"
                  : project.status === "Active"
                    ? "text-blue-600"
                    : "text-gray-500"
                  }`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border p-4 rounded-lg shadow-sm">
          <h2 className="text-md font-semibold mb-4 border-b pb-4">My Tasks</h2>
          <div className="space-y-2">
            {tasks.filter(
    t => t.assignee === user?.id
  ).map((task) => (
            <div key={task._id} className="p-1">
              <p className="text-sm font-semibold">
                {task.title}
              </p>
              <p 
              className={`text-sm ${
                task.dueDate &&
                new Date(task.dueDate) < new Date() &&
                task.status !== "Done"
                ? "text-red-500"
                : "text-gray-500"
              }`}
              >
                {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No due date"
                }
              </p>
            </div>
            ))}
          </div>
        </div>
      </div>
      {/* </div> */}

      {/* <div className='grid grid-cols-3 gap-4'>
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/project/${project.id}`)}
            className='bg-white shadow-md rounded p-4 cursor-pointer hover:shadow-lg'
          >
            <h2 className='text-lg font-semibold'>{project.name}</h2>
            <p className='text-gray-500 text-sm'>{project.tasks} Tasks</p>
          </div>
        ))}
      </div> */}
    </div>
  )
}

export default Dashboard

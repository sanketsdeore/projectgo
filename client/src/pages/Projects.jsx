import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateProjectModal from '../components/CreateProjectModal'
import axios from 'axios'
import { useOrganization } from '@clerk/clerk-react'

const Projects = () => {
    const navigate = useNavigate()

    const [projects, setProjects] = useState([])

    const [showModal, setShowModal] = useState(false)

    const [search, setSearch] = useState("")

    const { organization } = useOrganization();

    const orgId = organization?.id;

    const filteredProjects = projects.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                if (!orgId) return;

                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/projects?orgId=${orgId}`
                );
                setProjects(res.data)
            } catch (err) {
                console.error(err);
            }
        }
        fetchProjects()
    }, [orgId])

    const handleCreateProject = async (projectData) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/projects`,
                {
                    ...projectData,
                    orgId: organization?.id
                }
            )
            setProjects((prev) => [...prev, res.data])
        } catch (err) {
            console.error("Error creating project:", err)
        }
    }

    const { membership } = useOrganization();

    const role = membership?.role;

    const isAdmin = role === "org:admin";

    return (
        <div className='mr-6'>
            <div className='flex justify-between items-center'>
                <div>
                    <h1 className='text-2xl font-bold'>Projects</h1>
                    <p className='text-gray-500 text-sm py-1'>Manage and track your projects</p>
                </div>
                {isAdmin && (
                    <button
                        className='bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition'
                        onClick={() => setShowModal(true)}
                    >
                        + New Project
                    </button>
                )}

            </div>
            {showModal && (
                <CreateProjectModal
                    onClose={() => setShowModal(false)}
                    onCreate={handleCreateProject}
                />
            )}
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search projects...'
                className='w-1/3 px-4 py-2 mt-2 rounded-xl outline-none border border-gray-300 focus:ring-2 focus:ring-sky-200'
            />

            <div className='grid grid-cols-3 gap-4 mt-6'>
                {filteredProjects.map((project) => (
                    <div
                        key={project._id}
                        onClick={() => navigate(`/project/${project._id}`)}
                        className='bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition'
                    >
                        <h2 className='font-semibold'>{project.name}</h2>
                        <p className='text-sm text-gray-500'>{project.description}</p>
                        <div className='flex justify-between mt-3 text-sm'>
                            <span
                                className={`text-sm px-2 py-1 rounded ${project.status === "Active"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {project.status}
                            </span>
                            <span className='text-sm text-gray-500'>{project.priority} Priority</span>
                        </div>
                        <div className='mt-3 mb-2'>
                            <p className='text-xs font-semibold text-gray-500'>Progress</p>
                            <div className='w-full bg-gray-200 h-1.5 rounded mt-2'>
                                <div
                                    className='bg-blue-500 h-1.5 rounded'
                                    style={{ width: `${project.progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Projects

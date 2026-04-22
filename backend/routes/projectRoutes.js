import express from 'express'
import Project from '../models/Project.js'

const router = express.Router()

router.get("/", async (req, res) => {
    const { orgId } = req.query;

    if (!orgId) {
        return res.json([]);
    }

    try {
        const projects = await Project.find({ orgId })
        res.json(projects)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
        res.json(project)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post("/", async (req, res) => {
    try {
        const project = await Project.create(req.body)
        res.json(project)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.put("/:id", async (req, res) => {
    try {
        const updated = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { after: true }
        )
        res.json(updated)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

export default router
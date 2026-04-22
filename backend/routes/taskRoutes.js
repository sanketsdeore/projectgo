import express from 'express'
import Task from '../models/Task.js'

const router = express.Router()

router.post("/", async (req, res) => {
    try {
        const task = await Task.create(req.body)
        res.json(task)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get("/:projectId", async (req, res) => {
    try {
        const tasks = await Task.find({
            projectId: req.params.projectId
        })
        res.json(tasks)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.put("/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { after: true }
        )
        res.json(updatedTask)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get("/", async (req, res) => {
  try {
    const { orgId } = req.query;

    if (!orgId) {
      return res.json([]);
    }

    const tasks = await Task.find({ orgId });

    res.json(tasks);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

export default router
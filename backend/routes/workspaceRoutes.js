import express from 'express'
import Workspace from '../models/Workspace.js'

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, userId } = req.body;

        const workspace = await Workspace.create({
            name,
            owner: userId,
            members: [{ userId, role: "admin" }]
        });
        res.json(workspace);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params;

        const workspaces = await Workspace.find({
            "members.userId": userId,
        });

        res.json(workspaces);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
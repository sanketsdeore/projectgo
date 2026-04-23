import mongoose, { Schema } from 'mongoose'

const taskSchema = new mongoose.Schema({
    title: String,
    type: String,
    priority: String,
    status: String,
    assignee: String,
    dueDate: String,
    orgId: {
        type: String,
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }
}, { timestamps: true })

export default mongoose.model("Task", taskSchema)
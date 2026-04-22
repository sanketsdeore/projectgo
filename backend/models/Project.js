import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    status: String,
    priority: String,
    progress: Number,
    orgId: {
        type: String,
        required: true
    },
    startDate: String,
    endDate: String
}, { timestamps: true })

export default mongoose.model("Project", projectSchema)
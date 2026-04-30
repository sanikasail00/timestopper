const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    color: {
        type: String,
        default: '#3B82F6' // Default blue
    },
    start_time: {
        type: Date
    },
    end_time: {
        type: Date
    },
    elapsed_time: {
        type: Number,
        default: 0 // In seconds
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);

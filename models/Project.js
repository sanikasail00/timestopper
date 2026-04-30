const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
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
        default: '#8B5CF6' // Default purple
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', ProjectSchema);

const mongoose = require('mongoose');

const practicalSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    courseName: { 
        type: String, 
        required: true 
    },
    department: { 
        type: String, 
        required: true 
    },
    practicalNo: { 
        type: String, 
        required: true 
    },
    url: { 
        type: String, 
        required: true 
    },
    contributedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },
    contributionDate: { 
        type: Date, 
        default: Date.now 
    }
});

const practical = mongoose.model('practical', practicalSchema);
module.exports = practical;

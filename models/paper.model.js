const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
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
    paperType: {
        type: String,
        enum: ['MSE 1', 'MSE 2', 'Re MSE', 'ESE'], 
        required: true
    },
    url: { 
        type: String, 
        required: true 
    },
    contributedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
    },
    contributionDate: { 
        type: Date, 
        default: Date.now 
    }
});

const paper = mongoose.model('paper', paperSchema);
module.exports = paper;

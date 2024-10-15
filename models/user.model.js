const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    linkedinUrl: { 
        type: String 
    },
    papersContributed: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'paper',
            required: true
        }
    ],
    practicalsContributed: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'practical',
            required: true
        }
    ],
    isAdmin: { 
        type: Boolean, 
        default: false 
    },
    totalContributions: {
        type: Number,
        default: 0
    }
});

const user = mongoose.model('user', userSchema);
module.exports = user;

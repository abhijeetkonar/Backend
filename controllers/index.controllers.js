const User = require('../models/user.model');
const Paper = require('../models/paper.model');
const Practical = require('../models/practical.model');

module.exports.index = async (req, res, next) => {
    try {
        res.status(200).json({ message: 'Welcome to the API' });
    } catch(error) {
        next(error);
    }
}

module.exports.countDocuments = async (req, res, next) => {
    try {
        const users = await User.countDocuments();
        const papers = await Paper.countDocuments();
        const practicals = await Practical.countDocuments();

        res.status(200).json({ users, papers, practicals });
    } catch(error) {
        next(error);
    }
}

module.exports.topContributors = async (req, res, next) => {
    try {
        const users = await User.find().sort({ totalContributions: -1 }).limit(5);
        res.status(200).json({ users });
    } catch(error) {
        next(error);
    }
}

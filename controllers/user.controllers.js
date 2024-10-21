const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const blacklistModel = require('../models/blacklist.model');
const Paper = require('../models/paper.model');
const Practical = require('../models/practical.model');

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            message: 'User registered successfully',
            newUser,
            token
        });
        await newUser.save();
    } catch (error) {
        next(error);
    }
};

module.exports.signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({
            message: 'User signed in successfully',
            user,
            token
        });
    } catch (error) {
        next(error);
    }
}

module.exports.signout = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        const isTokenBlacklisted = await blacklistModel.findOne({ token });
        if (isTokenBlacklisted) {
            return res.status(400).json({ message: 'Token is blacklisted' });
        }

        await blacklistModel.create({ token });

        res.status(200).json({ message: 'User signed out successfully' });
    } catch (error) {
        next(error);
    }
}

module.exports.getProfile = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);

        res.status(200).json({
            message: 'Profile fetched successfully',
            user
        });

    } catch (error) {
        next(error);
    }
}

module.exports.updateProfile = async (req, res, next) => {
    try {
        const { username, email, linkedinUrl } = req.body;

        const user = await userModel.findByIdAndUpdate(req.user._id, { username, email, linkedinUrl }, { new: true });
        console.log(user);

        res.status(200).json({
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        next(error);
    }
}


module.exports.getUsersPapersContributions = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);

        let page = Number(req.query.page) || 1;
        let limit = 8;
        let skip = (page - 1) * limit;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const papers = await Paper
            .find({ _id: { $in: user.papersContributed } })
            .skip(skip)
            .limit(limit)
            .sort({ contributionDate: -1 });

        const totalDoc = await Paper.countDocuments({ _id: { $in: user.papersContributed } });
        res.status(200).json({
            message: 'User data with contributions retrieved successfully',
            papers: {
                username: user.username,
                papersContributed: papers,
            },
            totalDoc: totalDoc,
            nbHits: papers.length,
        });
    } catch (error) {
        next(error);
    }
};


module.exports.getUsersPracticalsContributions = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);

        let page = Number(req.query.page) || 1;
        let limit = 8;
        let skip = (page - 1) * limit;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const practicals = await Practical.find({ _id: { $in: user.practicalsContributed } })
            .skip(skip)
            .limit(limit)
            .sort({ contributionDate: -1 });

        const totalDoc = await Practical.countDocuments({ _id: { $in: user.practicalsContributed } });

        res.status(200).json({
            message: 'User data with contributions retrieved successfully',
            practicals: {
                username: user.username,
                practicalsContributed: practicals,
            },
            totalDoc: totalDoc,
            nbHits: practicals.length,
        });
    } catch (error) {
        next(error);
    }
}

module.exports.deleteContribution = async (req, res, next) => {
    try {
        const { type, contributionId } = req.params;
        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (type === 'papers') {
            const paper = await Paper.findByIdAndDelete(contributionId);
            if (!paper) {
                return res.status(404).json({ message: 'Paper not found' });
            }
            // const papers = await Paper.find({ _id: { $in: user.papersContributed } });
            await userModel.updateOne(
                { _id: req.user._id },
                { $pull: { papersContributed: contributionId } }
            );
            res.status(200).json({ message: 'Contribution deleted successfully' });
        } else {
            const practical = await Practical.findByIdAndDelete(contributionId);
            if (!practical) {
                return res.status(404).json({ message: 'Practical not found' });
            }
            // const practicals = await Practical.find({ _id: { $in: user.practicalsContributed } });
            await userModel.updateOne(
                { _id: req.user._id },
                { $pull: { practicalsContributed: contributionId } }
            );
            res.status(200).json({ message: 'Contribution deleted successfully' });
        }
        user.totalContributions = user.totalContributions - 1;
        await user.save();

    } catch (error) {
        next(error);
    }
};

const userModel = require('../models/user.model');
const blacklistModel = require('../models/blacklist.model');
const jwt = require('jsonwebtoken');

module.exports.isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, res) => {
            if(err){
                return "token expired";
            }
            return res;
        });

        if(decoded === "token expired"){
            return res.status(401).json({ message: 'Session expired! Please login again.' });
        }

        const isTokenBlacklisted = await blacklistModel.findOne({ token });
        if(isTokenBlacklisted){
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

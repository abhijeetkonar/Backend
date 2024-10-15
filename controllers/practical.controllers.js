const practicalModel = require("../models/practical.model");

module.exports.getPracticals = async (req, res, next) => {
    try {
        let page = Number(req.query.page) || 1;
        let limit = 10;
        let skip = (page - 1) * limit;

        const searchQuery = req.query.search || '';

        let filter = {};
        if (searchQuery) {
            filter = {
                $or: [
                    { courseName: { $regex: searchQuery, $options: 'i' } }, 
                    { department: { $regex: searchQuery, $options: 'i' } }, 
                    { practicalNo: { $regex: searchQuery, $options: 'i' } }, 
                ]
            };
        }

        const practicals = await practicalModel.find(filter).skip(skip).limit(limit).populate({
            path: 'contributedBy',
            select: 'username linkedinUrl'
        }).sort({ contributionDate: -1 });

        const totalDoc = await practicalModel.countDocuments(filter);

        res.status(200).json({ myPracticals: practicals, nbHits: practicals.length, totalDoc: totalDoc });
    } catch (error) {
        next(error);
    }
};
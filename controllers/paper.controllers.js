const paperModel = require("../models/paper.model");

module.exports.getPapers = async (req, res, next) => {
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
                    { paperType: { $regex: searchQuery, $options: 'i' } },
                ]
            };
        }

        const papers = await paperModel.find(filter).skip(skip).limit(limit).populate({
            path: 'contributedBy',
            select: 'username linkedinUrl'
        }).sort({ contributionDate: -1 });

        const totalDoc = await paperModel.countDocuments(filter);

        res.status(200).json({ myPapers: papers, nbHits: papers.length, totalDoc: totalDoc });
    } catch (error) {
        next(error);
    }
};

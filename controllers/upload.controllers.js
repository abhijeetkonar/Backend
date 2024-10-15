const paperModel = require("../models/paper.model");
const practicalModel = require("../models/practical.model");
const userModel = require("../models/user.model");

module.exports.uploadPaper = async (req, res, next) => {
    try {
        const { fileName, fileURL, courseName, department, paperType } = req.body;
        
        if(!fileURL) {
            return res.status(400).json({
                message: "Please Upload the file",
            });
        }

        if(!fileName || !courseName || !department || !paperType) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const paper = await paperModel.create({
            fileName,
            courseName,
            department,
            paperType,
            url: fileURL,
            contributedBy: req.user._id,
        });

        const user = await userModel.findById(req.user._id);
        user.papersContributed.push(paper._id);
        user.totalContributions += 1;
        await user.save();

        return res.status(200).json({
            message: "Paper uploaded successfully",
            paper,
        });
    } catch (error) {
        next(error);
    }
};

module.exports.uploadPractical = async (req, res, next) => {
    try {
        const { fileName, fileURL, courseName, department, practicalNo } = req.body;
        
        if(!fileURL) {
            return res.status(400).json({
                message: "Please Upload the file",
            });
        }

        if(!fileName || !courseName || !department || !practicalNo) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const practical = await practicalModel.create({
            fileName,
            courseName,
            department,
            practicalNo,
            url: fileURL,
            contributedBy: req.user._id,
        });

        const user = await userModel.findById(req.user._id);
        user.practicalsContributed.push(practical._id);
        user.totalContributions += 1;
        await user.save();

        return res.status(200).json({
            message: "Practical uploaded successfully",
            practical,
        });
    } catch (error) {
        next(error);
    }
};

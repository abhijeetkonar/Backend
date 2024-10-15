require("dotenv").config();
const express = require("express");
const connectDB = require("./config/mongodb");
const cors = require("cors");
const app = express();
app.use(cors());

const indexRoute = require("./routes/index.route");
const userRoute = require("./routes/user.route");
const uploadRoute = require("./routes/upload.route");
const paperRoute = require("./routes/paper.route");
const practicalRoute = require("./routes/practical.route");

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRoute);
app.use("/user", userRoute);
app.use("/upload", uploadRoute);
app.use("/papers", paperRoute);
app.use("/practicals", practicalRoute);

app.listen(process.env.PORT, () => {
    console.log(`server is runnning on port ${process.env.PORT}`);
})

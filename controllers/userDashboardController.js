const taskModel = require("../models/taskModel.js");

const dashboard = async (req, res) => {
  try {
    const userData = req.userInfo;
    const getUser = req.userInfo;
    const getAllTaskData = await taskModel
      .find({ userId: getUser.id })
      .sort("-createdAt")
      .limit(5);
    if (!getAllTaskData) {
      return res.status(500).json({
        status: false,
        message: "No Task Found!",
      });
    }
    console.log("from dashboard page");
    return res.status(200).json({
      status: true,
      message: "User Dashboard!",
      data: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      },
      totalTask: getAllTaskData.length,
      recentsTask: getAllTaskData,
    });
  } catch (e) {
    console.log("Error from dashboard", e);
    return res.status(500).json({
      status: false,
      message: "Internal Server error",
    });
  }
};
module.exports = dashboard;

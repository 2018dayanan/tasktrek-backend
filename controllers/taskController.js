const mongoose = require("mongoose");
const taskModel = require("../models/taskModel.js");

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const getUser = req.userInfo;
    // validate inputs
    if (!title) {
      return res.status(200).json({
        status: true,
        message: "Title filed is required",
      });
    }
    if (!description) {
      return res.status(200).json({
        status: true,
        message: "Description filed is required",
      });
    }
    if (!getUser) {
      return res.status(400).json({
        status: false,
        message: "Error Creating Task",
      });
    }
    const TaskCreated = await taskModel.create({
      userId: getUser.id,
      title,
      description,
    });

    return res.status(201).json({
      status: true,
      message: "Task Added Successfully!",
      data: TaskCreated,
    });
  } catch (e) {
    console.log("Error From Task controller", e);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// Get all Task
const getAllTask = async (req, res) => {
  try {
    const getAllTaskData = await taskModel.find({});
    return res.status(200).json({
      status: true,
      message: "Successfully fetched All Task",
      data: getAllTaskData,
    });
  } catch (e) {
    console.log("Error From get All Tasks", e);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// Get only user Task
const getOnlyUserTask = async (req, res) => {
  try {
    const getUser = req.userInfo;
    const getAllTaskData = await taskModel.find({ userId: getUser.id });
    if (!getAllTaskData) {
      return res.status(404).json({
        status: false,
        message: "No Task Found!",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Successfully fetched All Tasks",
      data: getAllTaskData,
    });
  } catch (e) {
    console.log("Error From get All Tasks", e);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
// Get single user Task
const getSingleTaskById = async (req, res) => {
  try {
    const { id: taskId } = req.params;

    // Validate the ObjectId
    if (!mongoose.isValidObjectId(taskId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid Task ID format!",
      });
    }

    const taskData = await taskModel.findById(taskId);

    if (!taskData) {
      return res.status(404).json({
        status: false,
        message: "Task not found!",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Successfully fetched the Task!",
      data: taskData,
    });
  } catch (error) {
    console.error("Error in fetching Task!", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// Delete Task by id
const deleteTaskById = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const { userId } = req.userInfo;

    // Validate the ObjectId
    if (!mongoose.isValidObjectId(taskId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid Task ID format!",
      });
    }

    const taskData = await taskModel.findOneAndDelete({ _id: taskId, userId });

    if (!taskData) {
      return res.status(404).json({
        status: false,
        message: "Task not found!",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Task Deleted Successfully!",
      title: taskData.title,
    });
  } catch (error) {
    console.error("Error in deleting Task", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id: taskId } = req.params;
    const { userId } = req.userInfo;

    // Validate input
    if (!title) {
      return res.status(400).json({
        status: false,
        message: "Title field is required",
      });
    }
    if (!description) {
      return res.status(400).json({
        status: false,
        message: "Description field is required",
      });
    }

    // Validate the ObjectId
    if (!mongoose.isValidObjectId(taskId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid task ID format!",
      });
    }

    // Update task
    const taskData = await taskModel.findOneAndUpdate(
      {
        _id: taskId,
        userId,
      },
      { title, description },
      { new: true }
    );

    if (!taskData) {
      return res.status(404).json({
        status: false,
        message: "Task not found!",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Task Updated Successfully!",
      data: taskData,
    });
  } catch (error) {
    console.error("Error in updating Task!", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
//
const toggleChecked = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    // Validate the ObjectId
    if (!mongoose.isValidObjectId(taskId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid task ID format!",
      });
    }
    const item = await taskModel.findById(taskId);
    if (!item) {
      return res.status(404).json({ message: "Task not found!" });
    }

    item.isChecked = !item.isChecked;

    await item.save();

    return res.status(200).json({
      status: true,
      message: `Item ${
        item.isFavorite ? "marked as Checked" : "removed from Checked"
      }`,
      item,
    });
  } catch (error) {
    console.error("Errof from Favorite", error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

// Search Task
const searchTask = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        status: false,
        message: "Please Enter Search Query!",
      });
    }
    const getUser = req.userInfo;
    const results = await taskModel.find({
      userId: getUser.id,
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    });
    return res.status(200).json({
      status: true,
      message: "Search Result!",
      task: results,
    });
  } catch (e) {
    console.error("Error From Search Query", error); 
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

module.exports = {
  createTask,
  getAllTask,
  getOnlyUserTask,
  getSingleTaskById,
  deleteTaskById,
  updateTask,
  toggleChecked,
  searchTask,
};

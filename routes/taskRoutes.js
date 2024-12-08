const express = require("express");

const router = express.Router();

const authController = require("../middleware/authMiddleware.js");

const {
  createTask,
  getOnlyUserTask,
  getSingleTaskById,
  deleteTaskById,
  updateTask,
  toggleChecked,
  searchTask,
} = require("../controllers/taskController.js");

// // Private routes
router.post("/addTask", authController, createTask);
// router.get("/getallTask", authController, getAllTask);
router.get("/getOnlyUserTask", authController, getOnlyUserTask);
router.get("/getTaskById/:id", authController, getSingleTaskById);
router.delete("/deleteTaskById/:id", authController, deleteTaskById);
router.patch("/updateTask/:id", authController, updateTask);
router.patch("/toggleChecked/:id", authController, toggleChecked);
router.get("/search", authController, searchTask);

module.exports = router;

import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import Workspace from "../models/workSpace.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, status, priority, dueDate } = req.body;

    const existingProject = await Project.findOne({
      _id: project,
      createdBy: req.user._id,
    });

    if (!existingProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // ── Validate assignedTo belongs to admin's workspace ──────────
    const adminWorkspace = await Workspace.findOne({ ownerId: req.user._id });

    if (!adminWorkspace) {
      return res.status(404).json({ success: false, message: "No workspace found" });
    }

    const member = await User.findOne({
      _id: assignedTo,
      workspaceId: adminWorkspace._id,
      role: { $in: ["freelancer", "member"] },
    });

    if (!member) {
      return res.status(403).json({
        success: false,
        message: "You can only assign tasks to your own freelancers/members",
      });
    }

    // Auto-add to project members if not already there
    if (!existingProject.members.map(String).includes(String(assignedTo))) {
      existingProject.members.push(assignedTo);
      await existingProject.save();
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      status: status || "todo",
      priority: priority || "medium",
      dueDate,
      createdBy: req.user._id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("project", "title client")
      .populate("assignedTo", "name email role");

    res.status(201).json({ success: true, task: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create task", error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const query = req.user.role === "admin"
      ? { createdBy: req.user._id }
      : { assignedTo: req.user._id };

    const tasks = await Task.find(query)
      .populate({
        path: "project",
        select: "title client",
        populate: { path: "client", select: "name email phone company" },
      })
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch tasks", error: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["todo", "in-progress", "completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid task status" });
    }

    const query = req.user.role === "admin"
      ? { _id: req.params.id, createdBy: req.user._id }
      : { _id: req.params.id, assignedTo: req.user._id };

    const task = await Task.findOneAndUpdate(query, { status }, { new: true })
      .populate({
        path: "project",
        select: "title client",
        populate: { path: "client", select: "name email phone company" },
      })
      .populate("assignedTo", "name email role");

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found or not assigned to you" });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update task", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete task", error: error.message });
  }
};
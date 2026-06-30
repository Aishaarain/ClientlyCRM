import Project from "../models/Project.js";
import Client from "../models/Client.js";
import User from "../models/user.js";
import Workspace from "../models/workSpace.js";

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      client,
      members = [],
      status,
      deadline,
      budget,
    } = req.body;

    const existingClient = await Client.findOne({
      _id: client,
      createdBy: req.user._id,
    });

    if (!existingClient) {
      return res.status(404).json({
        success: false,
        message: "Client not found or does not belong to you",
      });
    }

    // Only validate members if some were provided
    if (members.length > 0) {
      const adminWorkspace = await Workspace.findOne({ ownerId: req.user._id });

      if (!adminWorkspace) {
        return res.status(404).json({
          success: false,
          message: "No workspace found. Create a workspace first.",
        });
      }

      const validMembers = await User.find({
        _id: { $in: members },
        workspaceId: adminWorkspace._id,
        role: { $in: ["freelancer", "member"] },
      });

      if (validMembers.length !== members.length) {
        return res.status(403).json({
          success: false,
          message: "You can only add your own freelancers/members",
        });
      }
    }

    const project = await Project.create({
      title,
      description,
      client,
      members,
      status,
      deadline,
      budget,
      createdBy: req.user._id,
    });

    const populatedProject = await Project.findById(project._id)
      .populate("client", "name email phone company address")
      .populate("members", "name email role");

    res.status(201).json({
      success: true,
      project: populatedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    let query;

    if (req.user.role === "admin") {
      query = { createdBy: req.user._id };
    } else {
      query = { members: req.user._id };
    }

    const projects = await Project.find(query)
      .populate("client", "name email phone company address")
      .populate("members", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { members = [] } = req.body;

    // Validate members belong to admin's workspace
    if (members.length > 0) {
      const adminWorkspace = await Workspace.findOne({ ownerId: req.user._id });

      if (!adminWorkspace) {
        return res.status(404).json({
          success: false,
          message: "No workspace found.",
        });
      }

      const validMembers = await User.find({
        _id: { $in: members },
        workspaceId: adminWorkspace._id,
        role: { $in: ["freelancer", "member"] },
      });

      if (validMembers.length !== members.length) {
        return res.status(403).json({
          success: false,
          message: "You can only add your own freelancers/members",
        });
      }
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    )
      .populate("client", "name email phone company address")
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};

// projectController.js — add this export
export const getProjectById = async (req, res) => {
  try {
    let query;

    if (req.user.role === "admin") {
      query = { _id: req.params.id, createdBy: req.user._id };
    } else {
      query = { _id: req.params.id, members: req.user._id };
    }

    const project = await Project.findOne(query)
      .populate("client", "name email phone company address status")
      .populate("members", "name email role")
      .populate("createdBy", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};

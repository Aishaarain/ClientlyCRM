import Client from "../models/Client.js";
import Project from "../models/Project.js";
import Invoice from "../models/Invoice.js";
import InteractionLog from "../models/InteractionLog.js";

export const createClient = async (req, res) => {
  try {
    const { name, email, phone, company, address, status, notes } = req.body;

    const client = await Client.create({
      name,
      email,
      phone,
      company,
      address,
      status: status || "active",
      notes,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create client",
      error: error.message,
    });
  }
};

export const getClients = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const clients = await Client.find({
        createdBy: req.user._id,
      }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        clients,
      });
    }

    // Freelancer: only sees clients from their assigned projects
    const projects = await Project.find({
      members: req.user._id,
    }).populate("client", "name email phone company address status notes");

    const clientsMap = new Map();
    projects.forEach((project) => {
      if (project.client) {
        clientsMap.set(project.client._id.toString(), project.client);
      }
    });

    const clients = Array.from(clientsMap.values());

    res.status(200).json({
      success: true,
      clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
      error: error.message,
    });
  }
};

// NEW — GET /api/clients/:id
export const getClientById = async (req, res) => {
  try {
    let client;

    if (req.user.role === "admin") {
      // Admin can only see their own clients
      client = await Client.findOne({
        _id: req.params.id,
        createdBy: req.user._id,
      });
    } else {
      // Freelancer: only if they're a member of a project linked to this client
      const assigned = await Project.exists({
        client: req.params.id,
        members: req.user._id,
      });

      if (!assigned) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      client = await Client.findById(req.params.id);
    }

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Fetch related data scoped to this client
   // Replace the projects query inside getClientById
const [projects, invoices, interactions] = await Promise.all([
  Project.find({
    client: req.params.id,
    ...(req.user.role === "admin"
      ? { createdBy: req.user._id }
      : { members: req.user._id }),
  })
    .sort({ createdAt: -1 })
    .select("title status deadline budget"),

  Invoice.find({ client: req.params.id })
    .sort({ createdAt: -1 })
    .select("invoiceNumber amount status dueDate"),

  InteractionLog.find({ client: req.params.id })
    .sort({ date: -1 })
    .limit(10)
    .select("type notes date"),
]);

    res.status(200).json({
      success: true,
      client,
      projects,
      invoices,
      interactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch client",
      error: error.message,
    });
  }
};

export const updateClient = async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user._id,
      },
      req.body,
      { new: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update client",
      error: error.message,
    });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete client",
      error: error.message,
    });
  }
};
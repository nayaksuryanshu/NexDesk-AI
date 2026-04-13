const mongoose = require("mongoose");
const Ticket = require("../models/Ticket");
const Message = require("../models/Message");

const isStaffRole = (role) => role === "agent" || role === "admin";

const getCustomerId = (ticket) => {
  if (!ticket || !ticket.customerId) {
    return null;
  }

  if (typeof ticket.customerId === "object" && ticket.customerId._id) {
    return String(ticket.customerId._id);
  }

  return String(ticket.customerId);
};

const canAccessTicket = (user, ticket) => {
  if (!user) {
    return false;
  }

  if (isStaffRole(user.role)) {
    return true;
  }

  return getCustomerId(ticket) === String(user.id);
};

const createTicket = async (req, res) => {
  try {
    const { title, description, priority, assignedAgent } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const payload = {
      title,
      description,
      priority,
      customerId: req.user.id,
    };

    if (assignedAgent) {
      payload.assignedAgent = assignedAgent;
    }

    const ticket = await Ticket.create(payload);

    return res.status(201).json({ ticket });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create ticket" });
  }
};

const getTickets = async (req, res) => {
  try {
    const query = isStaffRole(req.user.role) ? {} : { customerId: req.user.id };

    const tickets = await Ticket.find(query)
      .populate("customerId", "name email role")
      .populate("assignedAgent", "name email role")
      .sort({ createdAt: -1 });

    return res.json({ tickets });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ticket id" });
    }

    const ticket = await Ticket.findById(id)
      .populate("customerId", "name email role")
      .populate("assignedAgent", "name email role");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (!canAccessTicket(req.user, ticket)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json({ ticket });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch ticket" });
  }
};

const getTicketMessages = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ticket id" });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (!canAccessTicket(req.user, ticket)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const messages = await Message.find({ ticketId: id }).sort({ timestamp: 1 });

    return res.json({ messages });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch ticket messages" });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ticket id" });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (!canAccessTicket(req.user, ticket)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { title, description, status, priority, assignedAgent } = req.body;
    const isStaff = isStaffRole(req.user.role);

    if (title !== undefined) {
      ticket.title = title;
    }

    if (description !== undefined) {
      ticket.description = description;
    }

    if (priority !== undefined) {
      ticket.priority = priority;
    }

    if (status !== undefined && (isStaff || String(req.user.id) === getCustomerId(ticket))) {
      ticket.status = status;

      if (status === "resolved" || status === "closed") {
        ticket.resolvedBy = isStaff ? "human" : "ai";
      } else if (status === "open" || status === "in_progress") {
        ticket.resolvedBy = null;
      }
    }

    if (isStaff && assignedAgent !== undefined) {
      ticket.assignedAgent = assignedAgent || null;
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate("customerId", "name email role")
      .populate("assignedAgent", "name email role");

    return res.json({ ticket: updatedTicket });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update ticket" });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ticket id" });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (!canAccessTicket(req.user, ticket)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Promise.all([
      ticket.deleteOne(),
      Message.deleteMany({ ticketId: id }),
    ]);

    return res.json({ message: "Ticket deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete ticket" });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  getTicketMessages,
  updateTicket,
  deleteTicket,
};
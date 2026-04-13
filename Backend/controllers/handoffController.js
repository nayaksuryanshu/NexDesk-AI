const mongoose = require("mongoose");
const Ticket = require("../models/Ticket");

const isStaffRole = (role) => role === "agent" || role === "admin";

const escalateToAgent = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { reason } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket id" });
    }

    const ticket = await Ticket.findById(ticketId).populate("customerId", "name email role");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const canAccess =
      isStaffRole(req.user.role) || String(ticket.customerId?._id || ticket.customerId) === String(req.user.id);

    if (!canAccess) {
      return res.status(403).json({ message: "Forbidden" });
    }

    ticket.status = "in_progress";
    ticket.escalatedAt = new Date();
    ticket.handoffReason = reason?.trim() || "Customer requested human support";
    ticket.resolvedBy = "human";

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticketId)
      .populate("customerId", "name email role")
      .populate("assignedAgent", "name email role");

    const io = req.app.get("io");
    if (io) {
      io.to("agents").emit("handoffRequested", {
        ticketId: updatedTicket._id,
        title: updatedTicket.title,
        reason: updatedTicket.handoffReason,
        escalatedAt: updatedTicket.escalatedAt,
        customer: updatedTicket.customerId?.name || updatedTicket.customerId?.email || "Unknown",
      });
    }

    return res.json({ ticket: updatedTicket, message: "Ticket escalated to a human agent" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to escalate ticket" });
  }
};

module.exports = {
  escalateToAgent,
};

const mongoose = require("mongoose");
const Ticket = require("../models/Ticket");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinAgentRoom", () => {
      socket.join("agents");
    });

    socket.on("requestHuman", async (payload = {}) => {
      try {
        const { ticketId, reason, customerName } = payload;

        if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) {
          socket.emit("handoffError", { message: "Invalid ticket id" });
          return;
        }

        const ticket = await Ticket.findById(ticketId).populate("customerId", "name email");

        if (!ticket) {
          socket.emit("handoffError", { message: "Ticket not found" });
          return;
        }

        ticket.status = "in_progress";
        ticket.escalatedAt = new Date();
        ticket.handoffReason = (reason || "Customer requested human support").trim();
        ticket.resolvedBy = "human";
        await ticket.save();

        io.to("agents").emit("handoffRequested", {
          ticketId: String(ticket._id),
          title: ticket.title,
          reason: ticket.handoffReason,
          escalatedAt: ticket.escalatedAt,
          customer: customerName || ticket.customerId?.name || ticket.customerId?.email || "Unknown",
        });

        io.to(String(ticket._id)).emit("handoffConfirmed", {
          ticketId: String(ticket._id),
          status: ticket.status,
          escalatedAt: ticket.escalatedAt,
          reason: ticket.handoffReason,
        });
      } catch (error) {
        socket.emit("handoffError", { message: "Unable to request human handoff" });
      }
    });
  });
};

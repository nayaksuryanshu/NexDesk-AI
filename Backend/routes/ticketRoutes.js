const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  createTicket,
  getTickets,
  getTicketById,
  getTicketMessages,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");

const router = express.Router();

router.use(verifyToken);

router.route("/").get(getTickets).post(createTicket);
router.get("/:id/messages", getTicketMessages);
router.route("/:id").get(getTicketById).put(updateTicket).delete(deleteTicket);

module.exports = router;
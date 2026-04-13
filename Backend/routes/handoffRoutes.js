const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { escalateToAgent } = require("../controllers/handoffController");

const router = express.Router();

router.use(verifyToken);
router.post("/:ticketId", escalateToAgent);

module.exports = router;

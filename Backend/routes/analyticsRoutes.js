const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const {
  getStats,
  getAiRate,
  getTicketVolume,
  getResponseTimes,
} = require("../controllers/analyticsController");

const router = express.Router();

router.use(verifyToken);
router.use(authorize(["agent", "admin"]));

router.get("/summary", getStats);
router.get("/ai-rate", getAiRate);
router.get("/ticket-volume", getTicketVolume);
router.get("/response-times", getResponseTimes);

module.exports = router;

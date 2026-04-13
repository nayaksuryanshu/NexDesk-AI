const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// POST /api/ai/query - Process AI query
router.post('/query', aiController.processAIQuery);

// GET /api/ai/health - Check AI service health
router.get('/health', aiController.healthCheck);

module.exports = router;

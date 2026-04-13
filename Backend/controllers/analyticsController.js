const Ticket = require("../models/Ticket");
const Message = require("../models/Message");

const startOfDay = (date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const getAiRate = async (req, res) => {
  try {
    const [aiResolved, humanResolved] = await Promise.all([
      Ticket.countDocuments({ resolvedBy: "ai" }),
      Ticket.countDocuments({ resolvedBy: "human" }),
    ]);

    const totalResolved = aiResolved + humanResolved;
    const aiResolutionRate = totalResolved > 0 ? Number(((aiResolved / totalResolved) * 100).toFixed(2)) : 0;

    return res.json({
      aiResolved,
      humanResolved,
      totalResolved,
      aiResolutionRate,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch AI rate" });
  }
};

const getTicketVolume = async (req, res) => {
  try {
    const days = Number(req.query.days || 7);
    const start = startOfDay(new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000));

    const grouped = await Ticket.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    const map = new Map(
      grouped.map((entry) => {
        const key = `${entry._id.year}-${String(entry._id.month).padStart(2, "0")}-${String(entry._id.day).padStart(2, "0")}`;
        return [key, entry.count];
      }),
    );

    const series = [];
    for (let index = 0; index < days; index += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      series.push({ date: key, count: map.get(key) || 0 });
    }

    return res.json({ series, days });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch ticket volume" });
  }
};

const getResponseTimes = async (req, res) => {
  try {
    const tickets = await Ticket.find().select("_id createdAt").lean();

    if (tickets.length === 0) {
      return res.json({ avgAiFirstResponseMs: 0, avgHumanFirstResponseMs: 0, avgAiFirstResponseMinutes: 0, avgHumanFirstResponseMinutes: 0 });
    }

    const ticketIds = tickets.map((ticket) => String(ticket._id));

    const firstMessages = await Message.aggregate([
      { $match: { ticketId: { $in: ticketIds } } },
      { $sort: { timestamp: 1 } },
      {
        $group: {
          _id: { ticketId: "$ticketId", role: "$role" },
          firstTimestamp: { $first: "$timestamp" },
        },
      },
    ]);

    const firstByTicket = new Map();
    firstMessages.forEach((entry) => {
      const key = String(entry._id.ticketId);
      if (!firstByTicket.has(key)) {
        firstByTicket.set(key, {});
      }
      firstByTicket.get(key)[entry._id.role] = new Date(entry.firstTimestamp).getTime();
    });

    const aiTimes = [];
    const humanTimes = [];

    tickets.forEach((ticket) => {
      const createdAt = new Date(ticket.createdAt).getTime();
      const record = firstByTicket.get(String(ticket._id));
      if (!record) return;

      if (record.ai) {
        aiTimes.push(Math.max(0, record.ai - createdAt));
      }

      const humanFirst = record.agent || record.human;
      if (humanFirst) {
        humanTimes.push(Math.max(0, humanFirst - createdAt));
      }
    });

    const avg = (list) => (list.length ? Math.round(list.reduce((sum, value) => sum + value, 0) / list.length) : 0);

    const avgAiFirstResponseMs = avg(aiTimes);
    const avgHumanFirstResponseMs = avg(humanTimes);

    return res.json({
      avgAiFirstResponseMs,
      avgHumanFirstResponseMs,
      avgAiFirstResponseMinutes: Number((avgAiFirstResponseMs / 60000).toFixed(2)),
      avgHumanFirstResponseMinutes: Number((avgHumanFirstResponseMs / 60000).toFixed(2)),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch response times" });
  }
};

const getStats = async (req, res) => {
  try {
    const [aiRate, ticketVolume, responseTimes, totalTickets, escalatedTickets] = await Promise.all([
      (async () => {
        const [aiResolved, humanResolved] = await Promise.all([
          Ticket.countDocuments({ resolvedBy: "ai" }),
          Ticket.countDocuments({ resolvedBy: "human" }),
        ]);
        const totalResolved = aiResolved + humanResolved;
        return {
          aiResolved,
          humanResolved,
          totalResolved,
          aiResolutionRate: totalResolved > 0 ? Number(((aiResolved / totalResolved) * 100).toFixed(2)) : 0,
        };
      })(),
      (async () => {
        const since = startOfDay(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000));
        const count = await Ticket.countDocuments({ createdAt: { $gte: since } });
        return { last7Days: count };
      })(),
      (async () => {
        const tickets = await Ticket.find().select("_id createdAt").lean();
        const ticketIds = tickets.map((ticket) => String(ticket._id));
        if (ticketIds.length === 0) {
          return { avgAiFirstResponseMinutes: 0, avgHumanFirstResponseMinutes: 0 };
        }

        const firstMessages = await Message.aggregate([
          { $match: { ticketId: { $in: ticketIds } } },
          { $sort: { timestamp: 1 } },
          {
            $group: {
              _id: { ticketId: "$ticketId", role: "$role" },
              firstTimestamp: { $first: "$timestamp" },
            },
          },
        ]);

        const firstByTicket = new Map();
        firstMessages.forEach((entry) => {
          const key = String(entry._id.ticketId);
          if (!firstByTicket.has(key)) {
            firstByTicket.set(key, {});
          }
          firstByTicket.get(key)[entry._id.role] = new Date(entry.firstTimestamp).getTime();
        });

        const aiTimes = [];
        const humanTimes = [];

        tickets.forEach((ticket) => {
          const createdAt = new Date(ticket.createdAt).getTime();
          const record = firstByTicket.get(String(ticket._id));
          if (!record) return;
          if (record.ai) aiTimes.push(Math.max(0, record.ai - createdAt));
          if (record.agent || record.human) humanTimes.push(Math.max(0, (record.agent || record.human) - createdAt));
        });

        const avg = (list) => (list.length ? list.reduce((sum, value) => sum + value, 0) / list.length : 0);

        return {
          avgAiFirstResponseMinutes: Number((avg(aiTimes) / 60000).toFixed(2)),
          avgHumanFirstResponseMinutes: Number((avg(humanTimes) / 60000).toFixed(2)),
        };
      })(),
      Ticket.countDocuments(),
      Ticket.countDocuments({ escalatedAt: { $ne: null } }),
    ]);

    return res.json({
      aiRate,
      ticketVolume,
      responseTimes,
      totalTickets,
      escalatedTickets,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch analytics summary" });
  }
};

module.exports = {
  getStats,
  getAiRate,
  getTicketVolume,
  getResponseTimes,
};

const Url = require("../models/Url");

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

const generateShortCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

// Keeps generating a random code until it finds one that isn't already
// taken. With 6 base36 characters there are ~2 billion combinations,
// so collisions are rare, but we still check rather than assume —
// otherwise Url.create() would throw a raw duplicate-key error.
const generateUniqueShortCode = async () => {
  const MAX_ATTEMPTS = 5;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = generateShortCode();
    const existing = await Url.findOne({ shortCode: code });

    if (!existing) {
      return code;
    }
  }

  throw new Error(
    "Could not generate a unique short code right now, please try again"
  );
};

// Only allow http/https links, and make sure the string is actually
// a parseable URL. Blocks javascript:, data:, file:, and similar
// dangerous schemes before they ever get saved to the database.
const isValidUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (error) {
    return false;
  }
};

// Custom aliases: letters, numbers, hyphens, underscores only, 3-20 chars.
const ALIAS_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

const isValidAlias = (alias) => {
  return ALIAS_REGEX.test(alias);
};

const RESERVED_ALIASES = ["api"];

// Rough device classification from the user-agent string, used for
// the analytics breakdown. Good enough to show "who's clicking from
// where" without pulling in a parsing library.
const getDeviceType = (userAgent = "") => {
  const ua = userAgent.toLowerCase();
  if (/bot|crawler|spider/.test(ua)) return "Bot";
  if (/ipad|tablet/.test(ua)) return "Tablet";
  if (/mobile|android|iphone/.test(ua)) return "Mobile";
  return "Desktop";
};

// Create Short URL
const createUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL. Must be a valid http:// or https:// link.",
      });
    }

    let shortCode;

    if (customAlias) {
      if (!isValidAlias(customAlias)) {
        return res.status(400).json({
          success: false,
          message:
            "Custom alias must be 3-20 characters and contain only letters, numbers, hyphens, or underscores.",
        });
      }

      if (RESERVED_ALIASES.includes(customAlias.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: `"${customAlias}" is a reserved word and can't be used as an alias.`,
        });
      }

      const existing = await Url.findOne({ shortCode: customAlias });

      if (existing) {
        return res.status(409).json({
          success: false,
          message: `"${customAlias}" is already taken. Please choose another alias.`,
        });
      }

      shortCode = customAlias;
    } else {
      shortCode = await generateUniqueShortCode();
    }

    const url = await Url.create({
      originalUrl,
      shortCode,
    });

    res.status(201).json({
      success: true,
      data: url,
      shortUrl: `${BASE_URL}/${shortCode}`,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "That short code is already taken. Please choose another alias.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All URLs
const getUrls = async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: urls.length,
      data: urls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Redirect — also where all click tracking happens.
// Uses 302 (temporary) rather than 301 (permanent) on purpose: a 301
// gets cached by the browser, so repeat visits never hit this server
// again and never get recorded. 302 guarantees every click is tracked.
const redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;

    const url = await Url.findOne({ shortCode: code });

    if (!url) {
      return res
        .status(404)
        .send(
          "<h1>404 - Link not found</h1><p>This short link doesn't exist or has been removed.</p>"
        );
    }

    if (!url.clickEvents) {
      url.clickEvents = [];
    }

    url.clicks += 1;

    url.clickEvents.push({
      timestamp: new Date(),
      userAgent: req.headers["user-agent"],
    });

    await url.save();

    res.redirect(302, url.originalUrl);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Analytics — total clicks, a time series (clicks per day), and a
// breakdown by device type, derived from clickEvents on every redirect.
const getAnalytics = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    const clicksByDay = {};
    const deviceCounts = {};

    url.clickEvents.forEach((event) => {
      const day = event.timestamp.toISOString().split("T")[0];
      clicksByDay[day] = (clicksByDay[day] || 0) + 1;

      const device = getDeviceType(event.userAgent);
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });

    const timeSeries = Object.entries(clicksByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => (a.date > b.date ? 1 : -1));

    const deviceBreakdown = Object.entries(deviceCounts).map(
      ([device, count]) => ({ device, count })
    );

    res.json({
      success: true,
      data: {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        clicks: url.clicks,
        createdAt: url.createdAt,
        timeSeries,
        deviceBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createUrl,
  getUrls,
  redirectUrl,
  getAnalytics,
};
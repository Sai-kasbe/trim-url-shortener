const express = require("express");

const {
  createUrl,
  getUrls,
  getAnalytics,
} = require("../controllers/urlController");

const router = express.Router();

router.post("/", createUrl);
router.get("/", getUrls);
router.get("/:shortCode/analytics", getAnalytics);

module.exports = router;
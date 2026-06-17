const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const urlRoutes = require("./routes/urlRoutes");
const { redirectUrl } = require("./controllers/urlController");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/urls", urlRoutes);

// Redirect route — delegates to the controller so click tracking
// (clicks counter + clickEvents history) actually runs.
app.get("/:code", redirectUrl);

app.get("/", (req, res) => {
  res.send("Trim API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
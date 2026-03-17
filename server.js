const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

require('dotenv').config();
const { Pool } = require('pg');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Static files
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/events", (req, res) => {
    res.render("events");
});

app.get("/team", (req, res) => {
    res.render("team");
});

app.get("/sponsors", (req, res) => {
    res.render("sponsors");
});

app.get("/what-is-asme", (req, res) => {
    res.render("what-is-asme");
});

app.get("/projects", (req, res) => {
    res.render("projects");
});

app.get('/contact', (req, res) => {
  const submitted = req.query.submitted;
  const error = req.query.error;

  res.render('contact', { submitted, error });
});

app.post('/contact', async (req, res) => {
  console.log("Form received");

  const { name, email, subject, message } = req.body;

  try {
    console.log("Saving to database...");

    await pool.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
      [name, email, subject, message]
    );

    console.log("Saved successfully");

    res.redirect('/contact?submitted=true');

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
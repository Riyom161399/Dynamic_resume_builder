const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();

//app.use(express.json()); // without this, req.body will be undefined
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "Frontend"))); // Serves your frontend files

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "@160902@joy", // set your MySQL password
  database: "IP_Project",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL!");
});

// Route to handle signup
app.post("/signUp", async (req, res) => {
  console.log("Request body:", req.body); // <-- Add this line to debug

  const { username, name, birth_date, email, password, confirm_password } =
    req.body;
  if (password !== confirm_password) {
    return res.status(400).send("Passwords do not match");
  }

  //const hashedPassword = await bcrypt.hash(password, 10);
  const sql = `INSERT INTO Member (username, name, birth_date, email, password) VALUES (?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [username, name, birth_date, email, password],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error inserting user");
      }
      res.send("Signup successful!");
    }
  );
});

// log in
// Login API

app.post("/api/login", (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing credentials" });
  }

  const query = "SELECT * FROM Member WHERE username = ? AND password = ?";
  db.query(query, [userName, password], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (results.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid ID or password" });
    }
  });
});

// job vacanccy

app.get("/api/jobs", async (req, res) => {
  try {
    console.log("Fetching jobs from API...");

    const response = await fetch("https://himalayas.app/jobs/api");
    if (!response.ok) {
      console.error(
        "Arbeitnow API error:",
        response.status,
        response.statusText
      );
      return res.status(500).json({ error: "Failed to fetch jobs from API" });
    }

    const data = await response.json();
    if (!data.jobs) {
      return res
        .status(500)
        .json({ error: "No jobs found in Himalayas API response" });
    }

    res.json({ jobs: data.jobs }); // make sure frontend gets jobs array
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Error fetching jobs" });
  }
});

// profile

// Route to fetch  profile
app.get("/api/profile/:id", (req, res) => {
  const profileusername = req.params.id;
  const query = `
      SELECT 
          email,name
      FROM Member 
      WHERE username = ?`;

  db.query(query, [profileusername], (err, results) => {
    if (err) {
      console.error("Failed to fetch profile data:", err);
      res.status(500).send("Server error");
    } else {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).send(" not found");
      }
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "homePage.html"));
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});

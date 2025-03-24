const express = require("express");
const path = require("path");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
app.use(cors());

const dbPath = path.join(__dirname, "test.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// register api
app.post("/users/", async (request, response) => {
  const { username, password } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Used parameterized query to prevent SQL injection
  const selectUserQuery = `SELECT * FROM users WHERE username = ?`;
  const dbUser = await db.get(selectUserQuery, [username]);

  if (dbUser === undefined) {
    const createUserQuery = `
            INSERT INTO users (username, password) 
            VALUES (?, ?)`;

    const dbResponse = await db.run(createUserQuery, [
      username,
      hashedPassword,
    ]);
    response.send(`Created new user with ID: ${dbResponse.lastID}`);
  } else {
    response.status(400).send("User already exists");
  }
});

//login api
app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM users WHERE username = '${username}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.status(400).json({ error_msg: "Invalid User" });
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      let payload = { username: username };
      let jwtToken = jwt.sign(payload, "My_Token");
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.status(400).json({ error_msg: "Invalid Password" });
    }
  }
});

// middleware function for Token Authenticate
const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "My_Token", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        request.username = payload.username;
        next();
      }
    });
  }
};

// Dashboard API (Protected)
app.get("/dashboard", authenticateToken, (req, res) => {
  let { username } = req;
  res.json({
    cards: [{ id: 1, title: `Welcome ${username}!!!` }],
  });
});

// Map API (Protected)
app.get("/map", authenticateToken, (req, res) => {
  res.json({ center: [20.5937, 78.9629], zoom: 5 }); // Coordinates for India
});

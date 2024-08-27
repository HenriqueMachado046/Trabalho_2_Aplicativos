import express from "express";
import sqlite3 from "sqlite3";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database(":memory:", (err) => {
  db.exec(
    `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE,
                password TEXT
            );
            
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                content TEXT,
                user_id INTEGER,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `,
    (err) => {
      if (err) {
        console.error("Error creating tables:", err.message);
      } else {
        console.log("Tables created successfully.");
      }
    }
  );
});

app.post("/api/users", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }
  db.run(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, password],
    function (err) {
      if (err) {
        console.error("Error inserting user:", err.message);
        return res.status(500).send("Error inserting user");
      }

      res.status(201).json({ id: this.lastID });
    }
  );
});

app.post("/api/auth", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }
  db.get(
    "SELECT id, email FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, row) => {
      if (err) {
        return res.status(500).send("Error authenticating user");
      }
      if (row) {
        const token = jwt.sign({ id: row.id, email: row.email }, "secret", {
          expiresIn: "1h",
        });
        res.status(200).json({ id: row.id, token });
      } else {
        res.status(401).send("Invalid email or password");
      }
    }
  );
});

const isAuthenticated = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token) {
    jwt.verify(token, "secret", (err, user) => {
      if (err) {
        return res.status(401).send("Invalid token");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).send("Token required");
  }
};


app.post("/api/posts", isAuthenticated, (req, res) => {
  const { title, content, user_id } = req.body;
 
  if (!title || !content || !user_id) {
    return res.status(400).send("Title, content, and user_id are required");
  }

  db.run(
    "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
    [title, content, user_id],
    function (err) {
      if (err) {
        console.error("Error inserting post:", err.message);
        return res.status(500).send("Error inserting post");
      }
      res.status(201).send("Post inserted");
    }
  );
});

app.get("/api/posts", isAuthenticated, (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  db.all(
    `
        SELECT posts.id, posts.title, posts.content, users.email 
        FROM posts 
        JOIN users ON posts.user_id = users.id 
        LIMIT ? OFFSET ?`,
    [limit, offset],
    (err, rows) => {
      if (err) {
        console.error("Error fetching posts:", err.message);
        return res.status(500).send("Error fetching posts");
      }
      console.log(rows);
      res.status(200).json(rows);
    }
  );
});

app.get("/api/users", (req, res) => {
  db.all("SELECT email FROM users", (err, rows) => {
    if (err) {
      res.status(500).send("Error fetching users");
    } else {
      res.status(200).send(rows);
    }
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

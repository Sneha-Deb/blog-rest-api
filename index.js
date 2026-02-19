import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

const port = process.env.APP_PORT || 4000;

const db = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("DB connection failed", err);
    process.exit(1);
  } else {
    console.log("Database Connected");
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production" && req.method !== "GET") {
    const secret = req.headers["x-admin-key"];
    if (secret !== process.env.ADMIN_KEY) {
      return res.status(403).send("Demo Mode - Write access disabled");
    }
  }
  next();
});

//CHALLENGE 1: GET All posts
app.get("/posts", async (req, res) => {
  try {
    const result = await db.query("SELECT * from blogs ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database Error" });
  }
});

//CHALLENGE 2: GET a specific post by id
app.get("/posts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const result = await db.query("SELECT * FROM blogs WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

//CHALLENGE 3: POST a new post
app.post("/posts", async (req, res) => {
  const { title, content, author } = req.body;

  try {
    if (!title || !content || !author) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await db.query(
      "INSERT INTO blogs (title, content, author, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *",
      [title, content, author],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//CHALLENGE 4: PATCH a post when you just want to update one parameter
app.patch("/posts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }
  const { title, content, author } = req.body;

  try {
    const check = await db.query("SELECT * FROM blogs WHERE id = $1", [id]);
    if (check.rows.length === 0)
      return res.status(404).json({ message: "Post not found" });

    const existingPost = check.rows[0];

    const result = await db.query(
      "UPDATE blogs SET title = $1, content = $2, author = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
      [
        title || existingPost.title,
        content || existingPost.content,
        author || existingPost.author,
        id,
      ],
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//CHALLENGE 5: DELETE a specific post by providing the post id.
app.delete("/posts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    const result = await db.query(
      "DELETE FROM blogs WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});

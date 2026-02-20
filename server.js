import express from "express";
import axios from "axios";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const port = process.env.PORT || process.env.SERVER_PORT || 3000;
const API_URL = process.env.API_URL;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production" && req.method !== "GET") {
    const secret = req.headers["x-admin-key"];
    if (secret !== process.env.ADMIN_KEY) {
      return res.status(403).send("Demo Mode - Write access disabled");
    }
  }
  next();
});

// Route to render the main page
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    res.render("index.ejs", { posts: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Route to render the create new page
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching post" });
  }
});

// fullylly update a post
app.post("/api/posts/:id", async (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    const response = await axios.patch(
      `${API_URL}/posts/${req.params.id}`,
      req.body,
    );
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating post" });
  }
});

// Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, req.body);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    if (error.response) {
      // This prints the "All fields are required" message instead of a crash log
      return res.status(400).json({ message: error.response.data.message });
    } else {
      return res.status(500).json({ message: "Error creating post" });
    }
  }
});

// Partially update a post
// render partial edit page
app.get("/partial-edit/:id", async (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    res.render("partialModify.ejs", {
      heading: "Edit Post Partially",
      submit: "Update Post Partially",
      post: response.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating post" });
  }
});

// Handle Partial Update form submission
app.post("/api/partial-posts/:id", async (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    const response = await axios.patch(
      `${API_URL}/posts/${req.params.id}`,
      req.body,
    );
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post
app.post("/api/posts/delete/:id", async (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    await axios.delete(`${API_URL}/posts/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});

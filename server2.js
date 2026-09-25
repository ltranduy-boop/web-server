import express from "express";

const app = express();
const PORT = 3000;
const aboutMe = {
  name: "Tran Duy Long",
  age: 20,
  identity: "Helicopter",
};
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World");
});

const entries = [
  { title: "First note", body: "Notes from the first session." },
  { title: "Second note", body: "Notes from the second session." },
  { title: "Third note", body: "Notes from the third session." },
];

app.get("/entries", (req, res) => {
  res.set("X-Total-Count", entries.length);
  res.status(200).render("entries", { title: "My Notes", entries });
});
app.delete("/entries/:index", (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (isNaN(index) || index < 1 || index > entries.length) {
    return res.status(400).send("Invalid index");
  }
  entries.splice(index - 1, 1);
  res.status(200).send("Entry deleted");
});
app.post("/entries", (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).send("Title and body are required");
  }
  entries.push({ title, body });
  res.status(201).send("Entry created");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

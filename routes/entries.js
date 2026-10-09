import { Router } from "express";
import { readFile, writeFile } from "node:fs/promises";
import { Ok, Err, Some, None } from "../result.js";
const router = Router();
/*
router.set("view engine", "ejs");
router.set("views", "views");
router.use(express.json());
router.use(express.static("public"));
router.use(express.urlencoded({ extended: true }));
*/
const validateEntry = ({ title, body }) => {
  if (!title || !body) return Err("title and body are required");
  return Ok({ title, body });
};
const findEntryById = (entries, id) => {
  const entry = entries[id];
  return entry ? Some(entry) : None;
};
const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

router.post("/", async (req, res) => {
  const { title, body } = req.body;
  const result = validateEntry({ title, body });
  if (!result.ok) {
    res.status(400).json({ error: result.error });
    return;
  }
  const data = await readFile("entries.json", "utf-8");
  const entries = JSON.parse(data);
  entries.push({ title, body });
  await writeFile("entries.json", JSON.stringify(entries, null, 2));
  res.status(201).json({ title, body });
});

router.post("/classic", async (req, res) => {
  const { title, body } = req.body;
  const result = validateEntry({ title, body });
  if (!result.ok) {
    res.status(400).json({ error: result.error });
    return;
  }

  const data = await readFile("entries.json", "utf-8");
  const entries = JSON.parse(data);
  entries.push({ title, body });
  await writeFile("entries.json", JSON.stringify(entries, null, 2));

  res.redirect("/entries");
});

router.get("/", async (req, res) => {
  const data = await readFile("entries.json", "utf-8");
  const entries = JSON.parse(data);
  res.set("X-Total-Count", entries.length);
  res.status(200).render("entries", { title: "My Notes", entries });
});

router.delete("/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id);
  const data = await readFile("entries.json", "utf-8");
  const entries = JSON.parse(data);
  const found = findEntryById(entries, id);
  if (!found.some) {
    res.status(404).json({ error: "Entry not found" });
    return;
  }
  entries.splice(id, 1);
  await writeFile("entries.json", JSON.stringify(entries, null, 2));

  res.status(204).send();
});
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const data = await readFile("entries.json", "utf-8");
    const entries = JSON.parse(data);

    const found = findEntryById(entries, id);
    if (!found.some) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }

    const result = validateEntry(req.body);
    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }

    entries[id] = result.value;
    await writeFile("entries.json", JSON.stringify(entries, null, 2));
    res.status(200).json(result.value);
  }),
);

export default router;

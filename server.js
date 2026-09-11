import express from "express";

const app = express();
const PORT = 3000;
app.use(function (req, res, next) {
  console.log("Calling");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello, web!");
});
app.get("/about", (req, res) => {
  const user = undefined;
  res.send(user.ban);
});
app.get("/search", (req, res) => {
  const pair = {
    term: req.query.term || "No search term provided",
    limit: req.query.limit || "0",
  };
  res.json(pair);
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

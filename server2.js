import express from "express";

const app = express();
const PORT = 3000;
const aboutMe = {
  name: "Tran Duy Long",
  age: 20,
  identity: "Helicopter",
};

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/aboutme", (req, res) => {
  res.json(aboutMe);
});

app.get("/add", (req, res) => {
  const { name, age } = req.query;
  const parsedAge = Number(age);

  if (!name || !Number.isInteger(parsedAge) || parsedAge < 0) {
    return res.status(400).json({
      error: "Provide a name and a non-negative integer age.",
    });
  }

  aboutMe.name = name;
  aboutMe.age = parsedAge;

  res.json(aboutMe);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

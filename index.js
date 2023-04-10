const express = require("express");
const connectDB = require("./config/db");
const { urlencoded } = require("express");
const cors = require("cors");

const app = express();

connectDB();

app.use(urlencoded({ extended: true }));
app.use(express.json({ extended: false })); //bodyParser
app.use(cors());

app.get("/", (req, res) => res.send("API RUNNING"));

//Define Routes
app.use("/api/students", require("./routes/students"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

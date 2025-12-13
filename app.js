require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const ERROR_CODES = require("./utils/errors");
const indexRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const auth = require("./middlewares/auth");
const { errors } = require("celebrate");

const app = express();
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(requestLogger);

// Crash test route, remove after review
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", indexRouter);
app.use("/items", require("./routes/clothingitems"));
app.use("/users", auth, require("./routes/users"));

app.use((req, res) => {
  res
    .status(ERROR_CODES.NOT_FOUND)
    .send({ message: "Requested resource not found" });
});
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

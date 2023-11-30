import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { configureDB } from "./dbConfiguration";

// routers imports
import generationDataRouter from "./routes/generation-data-routes";

dotenv.config();

//configure database
configureDB();

const app = express();

//add cors
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// set default timeout to 20 minutes
app.use((req, res, next) => {
  req.setTimeout(1200000);
  res.setTimeout(1200000);
  next();
});

//add body parser
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    msg: "Welcome to Totalizer Scraping API",
    version: "1.0.0",
    developer: "Aaron Mineen",
  });
});

//routers
app.use("/api/v0/generation-data", generationDataRouter);

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});

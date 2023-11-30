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

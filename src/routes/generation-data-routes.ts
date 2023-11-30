import express from "express";
import * as generationDataController from "../controllers/generation-data-controller";

const router = express.Router();

router.route("/").post(generationDataController.insertGenerationData);
router
  .route("/last-reading")
  .get(generationDataController.getLastGenerationDataReading);

router
  .route("/daily-data")
  .get(generationDataController.getGenerationDataByDate);

router
  .route("/totalizer-data")
  .get(generationDataController.getTotalizerDailyReadings);

export default router;

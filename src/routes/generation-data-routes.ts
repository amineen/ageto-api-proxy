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

router
  .route("/last-totalizer-reading")
  .get(generationDataController.getLastTotalizerRecord);

router
  .route("/update-last-totalizer-reading")
  .get(generationDataController.updateLastTotalizerRecord);

router
  .route("/totalizer-data-for-chart")
  .get(generationDataController.getTotalizerDailyReadingsForCharting);

router
  .route("/generation-data-for-chart")
  .get(generationDataController.getGenerationDataForCharting);

export default router;

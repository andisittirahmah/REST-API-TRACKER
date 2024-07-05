import Express from "express";

import {
  getAllTrackers,
  getDetails,
  createTracker,
  updateTracker,
  deleteTracker,
  expanseByCategory,
  expanseByDate,
} from "../controllers/tracker-controller.js";

const router = Express.Router();

router.route("/").get(getAllTrackers).post(createTracker);
router.route("/:id").put(updateTracker).delete(deleteTracker);
router.route("/details/:id").get(getDetails);
router.route("/total/category/").get(expanseByCategory);
router.route("/total/date-range/").get(expanseByDate);

export default router;

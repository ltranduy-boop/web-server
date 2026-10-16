import { Router } from "express";
import * as entriesController from "../controllers/entriesController.js";
const router = Router();
const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

router.post("/", asyncHandler(entriesController.create));
router.post("/classic", asyncHandler(entriesController.createClassic));

router.get("/", asyncHandler(entriesController.index));
router.delete("/:id", asyncHandler(entriesController.destroy));
router.put("/:id", asyncHandler(entriesController.update));

export default router;

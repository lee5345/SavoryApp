import express from "express";
import { parseRecipe } from "../controllers/parseController.js";

const router = express.Router();
router.post("/parse", parseRecipe);

export default router;
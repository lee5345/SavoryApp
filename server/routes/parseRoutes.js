import express from "express";
import { parseVideoFromURL } from "../controllers/parseController.js";

const router = express.Router();

router.post("/", parseVideoFromURL);

export default router;
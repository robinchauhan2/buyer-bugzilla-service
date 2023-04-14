import CreateBugController from "../controller/bugzilla.controller";
import express from "express";

const bugController = new CreateBugController()

const router = express.Router();
router.post("/create", bugController.createBug);
router.get("/getAllBug", bugController.getAllBug);

export default router;

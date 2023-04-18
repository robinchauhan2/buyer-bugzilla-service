import CreateBugController from "../controller/bugzilla.controller";
import express from "express";

const bugController = new CreateBugController()

const router = express.Router();
router.post("/create", bugController.createBug);
router.get("/getAllBug/:id", bugController.getAllBug);
router.put("/updateBug/:id", bugController.updateBug);




export default router;

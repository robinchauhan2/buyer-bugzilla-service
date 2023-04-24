"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bugzilla_controller_1 = __importDefault(require("../controller/bugzilla.controller"));
const express_1 = __importDefault(require("express"));
const bugController = new bugzilla_controller_1.default();
const router = express_1.default.Router();
router.post("/create", bugController.createBug);
router.get("/getAllBug/:id", bugController.getAllBug);
router.put("/updateBug/:id", bugController.updateBug);
exports.default = router;

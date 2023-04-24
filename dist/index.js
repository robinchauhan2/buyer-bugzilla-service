"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./shared/logger");
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT || 8000;
const app = (0, app_1.default)();
try {
    app.listen(port, () => {
        logger_1.logger.info(`Connected successfully on port ${port}`);
    });
}
catch (error) {
    logger_1.logger.error(`Error occured: ${error.message}`);
}

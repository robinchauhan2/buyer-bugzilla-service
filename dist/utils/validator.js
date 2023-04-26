"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBugSchemaValidator = void 0;
const joi_1 = __importDefault(require("joi"));
function CreateBugSchemaValidator(bugObject) {
    const schema = joi_1.default.object({
        product: joi_1.default.string().required(),
        component: joi_1.default.string().required(),
        version: joi_1.default.string().required(),
        summary: joi_1.default.string().required(),
        alias: joi_1.default.string().required(),
        op_sys: joi_1.default.string().required(),
        rep_platform: joi_1.default.string().required()
    });
    const { error } = schema.validate(bugObject);
    return error;
}
exports.CreateBugSchemaValidator = CreateBugSchemaValidator;

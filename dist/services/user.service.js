"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../shared/logger");
const HttpRequest_1 = __importDefault(require("../utils/HttpRequest"));
class UserService {
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postInstance = new HttpRequest_1.default({
                    url: '/rest/user',
                    method: 'post',
                    headers: { 'X-BUGZILLA-API-KEY': process.env.BUGZILLA_API_KEY },
                    data: data,
                });
                const response = yield postInstance.send();
                return response;
            }
            catch (error) {
                logger_1.logger.error(error);
                return error;
            }
        });
    }
    getUser({ userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postInstance = new HttpRequest_1.default({
                    url: `/rest/user/${userId}`,
                    method: 'get',
                    headers: { 'X-BUGZILLA-API-KEY': process.env.BUGZILLA_API_KEY },
                });
                const response = yield postInstance.send();
                return response;
            }
            catch (error) {
                logger_1.logger.error(error);
                return error;
            }
        });
    }
}
exports.default = UserService;

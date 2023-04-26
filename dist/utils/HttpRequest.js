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
const AxiosInstance_1 = __importDefault(require("./AxiosInstance"));
/**
 * Used to communicate with server
 */
class HttpRequest {
    constructor({ url, method = 'get', data, headers }) {
        this.method = 'get';
        this.url = url;
        this.method = method;
        this.data = data;
        this.headers = headers;
    }
    /**
     * Send http request to server to write data to / read data from server
     * axios library provides promise implementation to send request to server
     * Here we are using axios library for requesting a resource
     */
    send() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign(Object.assign({}, this.headers), (this.method.toLowerCase() != 'get' && { 'Content-Type': 'application/json' }));
                let result;
                if (this.method.toLowerCase() == 'get') {
                    result = yield (0, AxiosInstance_1.default)({
                        baseURL: process.env.BUGZILLA_BASE_URI,
                        url: this.url,
                        method: this.method,
                        headers: headers,
                        timeout: 180000, // If the request takes longer than `timeout`, the request will be aborted.
                    });
                }
                else {
                
                    // Make server request using axios
                    result = yield (0, AxiosInstance_1.default)({
                        baseURL: process.env.BUGZILLA_BASE_URI,
                        url: this.url,
                        method: this.method,
                        // headers: headers,
                        timeout: 180000,
                        data: JSON.stringify(this.data),
                    });
                
                }
                return result;
            }
            catch (err) {
                throw (_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message;
            }
        });
    }
}
exports.default = HttpRequest;

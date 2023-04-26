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
// import { CreateBugSchemaValidator } from '../utils/validator'
const logger_1 = require("../shared/logger");
const HttpRequest_1 = __importDefault(require("../utils/HttpRequest"));
const product_service_1 = __importDefault(require("./product.service"));
// import UserService from './user.service'
const productService = new product_service_1.default();
// const userService = new UserService()
class BugzillaBugService {
    constructor() {
        this.createBug = this.createBug.bind(this);
        this.updateBug = this.updateBug.bind(this);
    }
    createBug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let isProductExist = false;
            const data = {
                product: req.body.product,
                component: 'Components',
                version: 'unspecified',
                summary: req.body.summary,
                alias: req.body.alias,
                op_sys: 'ALL',
                rep_platform: 'ALL',
                bpp_id: req.body.bpp_id,
                bpp_name: req.body.bpp_name,
            };
            try {
                //   const error = CreateBugSchemaValidator(data)
                //   if (error) throw new Error(`Invalid payload:${error}`)
                //   logger.info('Hitting')
                productService
                    .getProduct({
                    productId: `${(data.product + data.bpp_id).toLowerCase().trim()}`,
                })
                    .then((value) => {
                    if (value.data.id) {
                        isProductExist = true;
                    }
                });
                if (!isProductExist) {
                    productService
                        .registerProduct({
                        name: `${(data.product + data.bpp_id).toLowerCase().trim()}`,
                        description: data.summary,
                        is_open: true,
                        has_unconfirmed: true,
                        version: 'Unspecified',
                    })
                        .then((value) => {
                        logger('vallue', value);
                    });
                }
                const createBug = new HttpRequest_1.default({
                    url: '/rest/bug',
                    method: 'post',
                    headers: { 'X-BUGZILLA-API-KEY': process.env.BUGZILLA_API_KEY },
                    data: {
                        name: `${(data.product + data.bpp_id).toLowerCase().trim()}`,
                        description: data.summary,
                        classification: 'Unclassified',
                        is_open: true,
                        has_unconfirmed: true,
                        version: 'unspecified',
                    },
                });
                const response = yield createBug.send();
                return res.status(201).json({ success: true, data: response === null || response === void 0 ? void 0 : response.data });
            }
            catch (error) {
                logger_1.logger.error(error);
                return res.status(500).json({ error: true, message: error || 'Something went wrong' });
            }
        });
    }
    getBug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getInstance = new HttpRequest_1.default({
                    url: `/rest/bug?id=${req.params.id}`,
                    method: 'get',
                    headers: { 'X-BUGZILLA-API-KEY': process.env.BUGZILLA_API_KEY },
                });
                const response = yield getInstance.send();
                return res.status(200).json({ success: true, data: response === null || response === void 0 ? void 0 : response.data });
            }
            catch (error) {
                logger_1.logger.error(error);
                return res.status(500).json({ error: true, message: (error === null || error === void 0 ? void 0 : error.message) || 'Something went wrong' });
            }
        });
    }
    updateBug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                product: req.body.product,
                component: req.body.component,
                version: req.body.version,
                summary: req.body.summary,
                alias: req.body.alias,
                op_sys: 'ALL',
                rep_platform: 'ALL',
                bpp_id: req.body.bpp_id,
                bpp_name: req.body.bpp_name,
            };
            try {
                const getInstance = new HttpRequest_1.default({
                    url: `/rest/bug/${req.params.id}`,
                    method: 'put',
                    data: { status: req.body.status },
                    headers: { 'X-BUGZILLA-API-KEY': process.env.BUGZILLA_API_KEY },
                });
                const response = yield getInstance.send();
                return res.status(200).json({ success: true, data: response === null || response === void 0 ? void 0 : response.data });
            }
            catch (error) {
                logger_1.logger.error(error);
                return res.status(500).json({ error: true, message: (error === null || error === void 0 ? void 0 : error.message) || 'Something went wrong' });
            }
        });
    }
}
exports.default = BugzillaBugService;

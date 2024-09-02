"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const countryController_1 = require("../controllers/adminControllers/countryController");
const adminAuthMiddleware_1 = require("../middlewares/adminAuthMiddleware");
const countryRouter = express_1.default.Router();
countryRouter.post('/addnewcountry', countryController_1.addNewCountry);
countryRouter.get('/getCountries', countryController_1.getCountries);
countryRouter.patch('/countrylistupdate', adminAuthMiddleware_1.adminProtect, countryController_1.country_list_unlist);
exports.default = countryRouter;

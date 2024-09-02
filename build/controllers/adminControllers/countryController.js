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
exports.country_list_unlist = exports.getCountries = exports.addNewCountry = void 0;
const countryModel_1 = require("../../models/countryModel");
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const addNewCountry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { country, flag } = req.body;
        const countryInCapital = country.toUpperCase();
        const isExists = yield countryModel_1.Country.findOne({ country: countryInCapital });
        if (!isExists) {
            const uploadResponse = yield cloudinary_1.default.uploader.upload(flag, {
                upload_preset: "linguaBlend",
            });
            const newcountry = new countryModel_1.Country({
                country: countryInCapital,
                flag: uploadResponse.url,
                list: true,
            });
            yield newcountry.save();
            res.status(200).json({ message: "country added successfully" });
        }
        else {
            res.status(401).json({ message: "country already exists" });
        }
    }
    catch (error) {
        res.status(400).json({ message: "country adding failed" });
    }
});
exports.addNewCountry = addNewCountry;
//----------------------------------------------------------------------
const getCountries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countries = yield countryModel_1.Country.find({});
        if (countries.length > 0) {
            res.status(200).json({ countries });
        }
        else {
            res.status(404).json({ message: "no countries available" });
        }
    }
    catch (error) {
        res.status(400);
        console.log(error);
    }
});
exports.getCountries = getCountries;
//-----------------------------------------------------------------------
const country_list_unlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { countryId } = req.body;
        yield countryModel_1.Country.findByIdAndUpdate({ _id: countryId }, [
            {
                $set: {
                    list: {
                        $cond: {
                            if: { $eq: ["$list", true] },
                            then: false,
                            else: true,
                        },
                    },
                },
            },
        ]);
        res.status(200).json({ message: "list update done" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "list update failed" });
    }
});
exports.country_list_unlist = country_list_unlist;

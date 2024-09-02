"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const authControllers_1 = require("../controllers/userControllers/authControllers");
const authRouter = express_1.default.Router();
const authMiddleware_1 = require("../middlewares/authMiddleware");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
authRouter.post('/signup', authControllers_1.create_user);
authRouter.post('/verifyOtp', authControllers_1.verifyOtp);
authRouter.post('/login', authControllers_1.login_user);
authRouter.patch('/finishProfile', authMiddleware_1.protect, upload.single('photo'), authControllers_1.finishProfile);
// authRouter.post('/signupwithgoogle',create_google_user) 
// authRouter.post('/resendotp',resendOtp)
// authRouter.post('/clearotp',clearOtp)
// authRouter.post('/logout',logout)
// authRouter.post('/contactadmin',contactAdmin)
exports.default = authRouter;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'users'
    },
    content: {
        type: String,
        trim: true
    },
    chatId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'chats'
    },
    unread: {
        type: Boolean,
        default: true
    },
    recieverId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'users'
    }
}, {
    timestamps: true
});
exports.Message = mongoose_1.default.model('messages', messageSchema);

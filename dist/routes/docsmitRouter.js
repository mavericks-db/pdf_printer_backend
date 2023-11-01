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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = express_1.default.Router();
// env variables
const docsmitCredential = {
    email: process.env.USERNAME,
    password: process.env.PASSWORD,
    softwareID: process.env.SOFTWAREID,
};
// middleware
const getToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${process.env.BASEAPI}/token`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(docsmitCredential),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch token. Status: ${response.status}`);
        }
        const data = yield response.json();
        req.session.token = data.token;
        console.log(req.session);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    next();
});
// create a new message
router.post('/messages/new', [getToken, upload.single('pdf')], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, rtnName, rtnAddress1, sendType, envelope } = req.body;
        console.log(req.body);
        const messageObject = {
            title,
            rtnName,
            rtnAddress1,
            rtnState: 'WA',
            rtnZip: '12345-1234',
        };
        // create a new message
        const response = yield fetch(`${process.env.BASEAPI}/messages/new`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${Buffer.from(`${req.session.token}:`).toString('base64')}`,
            },
            body: JSON.stringify(messageObject),
        });
        if (!response.ok) {
            throw new Error('Failed to create a new message');
        }
        const data = yield response.json();
        req.session.messageID = data.messageID;
        // upload the file
        const response2 = yield fetch(`${process.env.BASEAPI}/messages/${req.session.messageID}/upload`, {
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Basic ${Buffer.from(`${req.session.token}:`).toString('base64')}`,
            },
            body: req.file,
        });
        if (!response2.ok) {
            throw new Error('Failed to upload the file');
        }
        res.status(200).json({
            msg: 'File uploaded successfully.',
            msgID: req.session.messageID,
            token: req.session.token,
        });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// get message details
router.post('/messages/details', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, token } = req.body;
        const response = yield fetch(`${process.env.BASEAPI}/messages/${id}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${token}:`).toString('base64')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to get message details');
        }
        const data = yield response.json();
        res.status(200).json({ data: data });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;

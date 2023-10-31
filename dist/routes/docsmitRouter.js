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
        const response = yield fetch(`${process.env.BASEURL}/token`, {
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
// middleware
const addTokenToHeaders = (req, res, next) => {
    if (req.session.token) {
        req.headers['Authorization'] = `Basic ${Buffer.from(`${req.session.token}:`).toString('base64')}`;
    }
    next();
};
// create a new message
router.post('/message/new', getToken, addTokenToHeaders, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, rtnName, rtnAddress1 } = req.body;
    const messageObject = {
        title,
        rtnName,
        rtnAddress1,
    };
    try {
        const response = yield fetch(`${process.env.BASEURL}/message/new`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageObject),
        });
        const data = yield response.json();
        res.status(200).json({ data: data, messageObject: messageObject });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    // res.status(200).json({
    //   status: 'Message successfully created.',
    //   messageID: 'placeholder for message ID',
    //   token: req.session.token,
    // });
}));
exports.default = router;

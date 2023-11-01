"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
// env variables
const port = process.env.PORT;
// express instance
const app = (0, express_1.default)();
// middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: 'session secret',
    resave: false,
    saveUninitialized: true,
}));
app.use((0, cors_1.default)());
const docsmitRouter_1 = __importDefault(require("./routes/docsmitRouter"));
app.use('/api', docsmitRouter_1.default);
// home route
app.get('/', (req, res) => {
    res.status(200).send('Express');
});
// listen to port
app.listen(port, () => {
    console.log(`now runnning at http://localhost:${port}`);
});

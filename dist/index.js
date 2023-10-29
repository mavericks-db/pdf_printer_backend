"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
// env variables
const port = process.env.PORT;
// express instance
const app = (0, express_1.default)();
// home route
app.get('/', (req, res) => {
    res.status(200).send('Express');
});
// listen to port
app.listen(port, () => {
    console.log(`now runnning at http://localhost:${port}`);
});

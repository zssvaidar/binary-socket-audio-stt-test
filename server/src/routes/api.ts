import express from 'express';
const router = express.Router();
import tts from "./tts";
const API_VERSION = 'v1';

router.use(`/api/${API_VERSION}`, tts);

export default router;

import express from 'express';
import TTSController from "../app/Http/Controllers/TTSController";
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

const controller = new TTSController();
router.get('/TTS', (request: Request, response: Response, next: NextFunction) => {
    controller.TTS_DATA(request, response, next);
});

export default router;
import { Request, Response, NextFunction } from 'express';

export default class TTSController {
    /**
     * Example method
     */
    public async TTS_DATA(request: Request, response: Response, next: NextFunction) {
        try {
            const data: any = {
                D1: [
                    {
                        id: 1,
                        name: 'name_1',
                        text: 'text_1'
                    }
                ]
            };

            // Send response
            return response.send(data);
        } catch (error) {
            next(error);
        }
    }
}

import { Request, Response } from 'express';
export declare const getAllEventTypes: (_req: Request, res: Response) => Promise<void>;
export declare const getPublicEventType: (req: Request<{
    username: string;
    slug: string;
}>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createEventType: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateEventType: (req: Request<{
    id: string;
}>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteEventType: (req: Request<{
    id: string;
}>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPublicUser: (req: Request<{
    username: string;
}>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=eventTypes.controller.d.ts.map
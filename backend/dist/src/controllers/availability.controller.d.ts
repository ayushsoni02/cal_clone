import { Request, Response } from 'express';
export declare const getAvailability: (_req: Request, res: Response) => Promise<void>;
export declare const updateAvailability: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getOverrides: (_req: Request, res: Response) => Promise<void>;
export declare const createOverride: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteOverride: (req: Request<{
    id: string;
}>, res: Response) => Promise<void>;
//# sourceMappingURL=availability.controller.d.ts.map
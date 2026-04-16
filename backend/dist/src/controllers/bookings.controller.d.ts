import { Request, Response } from 'express';
export declare const getAllBookings: (_req: Request, res: Response) => Promise<void>;
export declare const getSlots: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const cancelBooking: (req: Request<{
    id: string;
}>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const rescheduleBooking: (req: Request<{
    id: string;
}>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=bookings.controller.d.ts.map
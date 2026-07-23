import type { Response } from 'express';
import { TallyService } from './tally.service';
export declare class TallyController {
    private readonly tallyService;
    constructor(tallyService: TallyService);
    exportStockItems(req: any, res: Response): Promise<void>;
    exportSalesVouchers(startDate: string, endDate: string, req: any, res: Response): Promise<void>;
    testConnection(req: any): Promise<{
        connected: boolean;
        message: string;
    }>;
    pullStock(req: any): Promise<{
        count: number;
        items: {
            name: any;
            parent: any;
            closingBalance: any;
            closingRate: any;
            closingValue: any;
            unit: any;
        }[];
    }>;
    pushVouchers(startDate: string, endDate: string, req: any): Promise<{
        created: number;
        errors: number;
        rawResponse: string;
    }>;
}

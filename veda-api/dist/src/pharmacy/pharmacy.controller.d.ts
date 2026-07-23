import { PharmacyService } from './pharmacy.service';
export declare class PharmacyController {
    private readonly pharmacyService;
    constructor(pharmacyService: PharmacyService);
    createSale(saleData: any, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/pharmacy-sale.schema").PharmacySaleDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/pharmacy-sale.schema").PharmacySale & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getDailySettlement(req: any, date: string): Promise<{
        UPI: number;
        CASH: number;
        CARD: number;
        TOTAL: number;
        TOTAL_BILLS: number;
    }>;
    getAllSales(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/pharmacy-sale.schema").PharmacySaleDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/pharmacy-sale.schema").PharmacySale & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}

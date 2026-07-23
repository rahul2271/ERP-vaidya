import { Model, Types } from 'mongoose';
import { PharmacySale, PharmacySaleDocument } from './schemas/pharmacy-sale.schema';
export declare class PharmacyService {
    private pharmacySaleModel;
    private inventoryModel;
    constructor(pharmacySaleModel: Model<PharmacySaleDocument>, inventoryModel: Model<any>);
    createSale(saleData: any, user: any): Promise<import("mongoose").Document<unknown, {}, PharmacySaleDocument, {}, import("mongoose").DefaultSchemaOptions> & PharmacySale & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getDailySettlement(hospitalId: string, date: string): Promise<{
        UPI: number;
        CASH: number;
        CARD: number;
        TOTAL: number;
        TOTAL_BILLS: number;
    }>;
    getAllSales(hospitalId: string): Promise<(import("mongoose").Document<unknown, {}, PharmacySaleDocument, {}, import("mongoose").DefaultSchemaOptions> & PharmacySale & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}

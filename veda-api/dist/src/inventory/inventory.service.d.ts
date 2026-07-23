import { Model, Types } from 'mongoose';
import { Inventory } from './schemas/inventory.schema';
import { InventoryHistory } from './schemas/inventory-history.schema';
export declare class InventoryService {
    private inventoryModel;
    private historyModel;
    constructor(inventoryModel: Model<Inventory>, historyModel: Model<InventoryHistory>);
    create(createDto: any, user: any): Promise<import("mongoose").Document<unknown, {}, Inventory, {}, import("mongoose").DefaultSchemaOptions> & Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(hospitalId: string): Promise<(import("mongoose").Document<unknown, {}, Inventory, {}, import("mongoose").DefaultSchemaOptions> & Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, Inventory, {}, import("mongoose").DefaultSchemaOptions> & Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, Inventory, {}, import("mongoose").DefaultSchemaOptions> & Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getLowStockAlerts(hospitalId: string): Promise<(import("mongoose").Document<unknown, {}, Inventory, {}, import("mongoose").DefaultSchemaOptions> & Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getHistory(hospitalId: string): Promise<(import("mongoose").Document<unknown, {}, InventoryHistory, {}, import("mongoose").DefaultSchemaOptions> & InventoryHistory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    deductStock(inventoryId: string, quantity: number, hospitalId: string, userId: string, notes: string): Promise<import("mongoose").Document<unknown, {}, InventoryHistory, {}, import("mongoose").DefaultSchemaOptions> & InventoryHistory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    reduceStock(id: string, quantity: number): Promise<import("mongoose").Document<unknown, {}, Inventory, {}, import("mongoose").DefaultSchemaOptions> & Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}

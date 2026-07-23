import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    create(createDto: any, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").Inventory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/inventory.schema").Inventory & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").Inventory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/inventory.schema").Inventory & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getLowStock(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").Inventory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/inventory.schema").Inventory & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getHistory(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/inventory-history.schema").InventoryHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/inventory-history.schema").InventoryHistory & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    deduct(deductDto: any, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/inventory-history.schema").InventoryHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/inventory-history.schema").InventoryHistory & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").Inventory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/inventory.schema").Inventory & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

import { Document, Types } from 'mongoose';
export declare class InventoryHistory extends Document {
    inventoryId: Types.ObjectId;
    changeType: 'ADDITION' | 'DEDUCTION';
    quantity: number;
    performedBy: Types.ObjectId;
    notes: string;
    hospitalId: Types.ObjectId;
}
export declare const InventoryHistorySchema: import("mongoose").Schema<InventoryHistory, import("mongoose").Model<InventoryHistory, any, any, any, any, any, InventoryHistory>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, InventoryHistory, Document<unknown, {}, InventoryHistory, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<InventoryHistory & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, InventoryHistory, Document<unknown, {}, InventoryHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InventoryHistory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    hospitalId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, InventoryHistory, Document<unknown, {}, InventoryHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InventoryHistory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    inventoryId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, InventoryHistory, Document<unknown, {}, InventoryHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InventoryHistory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, InventoryHistory, Document<unknown, {}, InventoryHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InventoryHistory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string, InventoryHistory, Document<unknown, {}, InventoryHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InventoryHistory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    changeType?: import("mongoose").SchemaDefinitionProperty<"ADDITION" | "DEDUCTION", InventoryHistory, Document<unknown, {}, InventoryHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InventoryHistory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    performedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, InventoryHistory, Document<unknown, {}, InventoryHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InventoryHistory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, InventoryHistory>;

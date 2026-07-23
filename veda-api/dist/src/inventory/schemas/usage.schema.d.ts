import { Document, Types } from 'mongoose';
export declare class InventoryUsage extends Document {
    inventoryId: Types.ObjectId;
    appointmentId: Types.ObjectId;
    quantityUsed: number;
    hospitalId: Types.ObjectId;
}
export declare const InventoryUsageSchema: import("mongoose").Schema<InventoryUsage, import("mongoose").Model<InventoryUsage, any, any, any, any, any, InventoryUsage>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, InventoryUsage, Document<unknown, {}, InventoryUsage, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<InventoryUsage & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, InventoryUsage, Document<unknown, {}, InventoryUsage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InventoryUsage & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    hospitalId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, InventoryUsage, Document<unknown, {}, InventoryUsage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InventoryUsage & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    inventoryId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, InventoryUsage, Document<unknown, {}, InventoryUsage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InventoryUsage & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    appointmentId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, InventoryUsage, Document<unknown, {}, InventoryUsage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InventoryUsage & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    quantityUsed?: import("mongoose").SchemaDefinitionProperty<number, InventoryUsage, Document<unknown, {}, InventoryUsage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<InventoryUsage & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, InventoryUsage>;

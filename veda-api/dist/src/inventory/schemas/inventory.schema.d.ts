import { Document, Types } from 'mongoose';
export declare class Inventory extends Document {
    name: string;
    category: string;
    quantity: number;
    unit: string;
    price: number;
    minLevel: number;
    hospitalId: Types.ObjectId;
}
export declare const InventorySchema: import("mongoose").Schema<Inventory, import("mongoose").Model<Inventory, any, any, any, any, any, Inventory>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Inventory, Document<unknown, {}, Inventory, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    hospitalId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    unit?: import("mongoose").SchemaDefinitionProperty<string, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<number, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    minLevel?: import("mongoose").SchemaDefinitionProperty<number, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Inventory>;

import { Document, Types } from 'mongoose';
export type PharmacySaleDocument = PharmacySale & Document;
export declare class PharmacySale {
    hospitalId: Types.ObjectId;
    customerName: string;
    customerPhone: string;
    patientId: Types.ObjectId;
    items: {
        inventoryId: Types.ObjectId;
        name: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
    }[];
    subtotal: number;
    discount: {
        percentage: number;
        amount: number;
    };
    grandTotal: number;
    paymentMode: string;
    paymentStatus: string;
    soldBy: Types.ObjectId;
}
export declare const PharmacySaleSchema: import("mongoose").Schema<PharmacySale, import("mongoose").Model<PharmacySale, any, any, any, any, any, PharmacySale>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PharmacySale, Document<unknown, {}, PharmacySale, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<PharmacySale & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    hospitalId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, PharmacySale, Document<unknown, {}, PharmacySale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PharmacySale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customerName?: import("mongoose").SchemaDefinitionProperty<string, PharmacySale, Document<unknown, {}, PharmacySale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PharmacySale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customerPhone?: import("mongoose").SchemaDefinitionProperty<string, PharmacySale, Document<unknown, {}, PharmacySale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PharmacySale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    patientId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, PharmacySale, Document<unknown, {}, PharmacySale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PharmacySale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    items?: import("mongoose").SchemaDefinitionProperty<{
        inventoryId: Types.ObjectId;
        name: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
    }[], PharmacySale, Document<unknown, {}, PharmacySale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PharmacySale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    subtotal?: import("mongoose").SchemaDefinitionProperty<number, PharmacySale, Document<unknown, {}, PharmacySale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PharmacySale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    discount?: import("mongoose").SchemaDefinitionProperty<{
        percentage: number;
        amount: number;
    }, PharmacySale, Document<unknown, {}, PharmacySale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PharmacySale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    grandTotal?: import("mongoose").SchemaDefinitionProperty<number, PharmacySale, Document<unknown, {}, PharmacySale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PharmacySale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paymentMode?: import("mongoose").SchemaDefinitionProperty<string, PharmacySale, Document<unknown, {}, PharmacySale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PharmacySale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paymentStatus?: import("mongoose").SchemaDefinitionProperty<string, PharmacySale, Document<unknown, {}, PharmacySale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PharmacySale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    soldBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, PharmacySale, Document<unknown, {}, PharmacySale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PharmacySale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, PharmacySale>;

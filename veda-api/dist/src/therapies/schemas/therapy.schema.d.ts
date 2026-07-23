import { Document, Types } from 'mongoose';
export type TherapyDocument = Therapy & Document;
export declare class Therapy {
    patientName: string;
    patientId: Types.ObjectId;
    therapyName: string;
    therapistId: Types.ObjectId;
    roomNumber: string;
    date: Date;
    time: string;
    status: string;
    hospitalId: string;
}
export declare const TherapySchema: import("mongoose").Schema<Therapy, import("mongoose").Model<Therapy, any, any, any, any, any, Therapy>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Therapy, Document<unknown, {}, Therapy, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Therapy & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    patientName?: import("mongoose").SchemaDefinitionProperty<string, Therapy, Document<unknown, {}, Therapy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Therapy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    patientId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Therapy, Document<unknown, {}, Therapy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Therapy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    therapyName?: import("mongoose").SchemaDefinitionProperty<string, Therapy, Document<unknown, {}, Therapy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Therapy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    therapistId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Therapy, Document<unknown, {}, Therapy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Therapy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    roomNumber?: import("mongoose").SchemaDefinitionProperty<string, Therapy, Document<unknown, {}, Therapy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Therapy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<Date, Therapy, Document<unknown, {}, Therapy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Therapy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    time?: import("mongoose").SchemaDefinitionProperty<string, Therapy, Document<unknown, {}, Therapy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Therapy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Therapy, Document<unknown, {}, Therapy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Therapy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    hospitalId?: import("mongoose").SchemaDefinitionProperty<string, Therapy, Document<unknown, {}, Therapy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Therapy & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Therapy>;

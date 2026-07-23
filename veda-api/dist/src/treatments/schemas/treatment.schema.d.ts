import { Document, Types } from 'mongoose';
export type TreatmentDocument = Treatment & Document;
export declare class Treatment {
    hospitalId: Types.ObjectId;
    name: string;
    cost: number;
    durationMin: number;
    isActive: boolean;
}
export declare const TreatmentSchema: import("mongoose").Schema<Treatment, import("mongoose").Model<Treatment, any, any, any, any, any, Treatment>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Treatment, Document<unknown, {}, Treatment, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Treatment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    hospitalId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Treatment, Document<unknown, {}, Treatment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Treatment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Treatment, Document<unknown, {}, Treatment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Treatment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    cost?: import("mongoose").SchemaDefinitionProperty<number, Treatment, Document<unknown, {}, Treatment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Treatment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    durationMin?: import("mongoose").SchemaDefinitionProperty<number, Treatment, Document<unknown, {}, Treatment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Treatment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Treatment, Document<unknown, {}, Treatment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Treatment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Treatment>;

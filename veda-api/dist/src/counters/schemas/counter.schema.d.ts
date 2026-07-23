import { Document, Types } from 'mongoose';
export type CounterDocument = Counter & Document;
export declare class Counter {
    hospitalId: Types.ObjectId;
    series: string;
    seq: number;
}
export declare const CounterSchema: import("mongoose").Schema<Counter, import("mongoose").Model<Counter, any, any, any, any, any, Counter>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Counter, Document<unknown, {}, Counter, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Counter & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    hospitalId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Counter, Document<unknown, {}, Counter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Counter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    series?: import("mongoose").SchemaDefinitionProperty<string, Counter, Document<unknown, {}, Counter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Counter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    seq?: import("mongoose").SchemaDefinitionProperty<number, Counter, Document<unknown, {}, Counter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Counter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Counter>;

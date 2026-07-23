import { Document, Types } from 'mongoose';
import { Hospital } from '../../hospitals/schemas/hospital.schema';
import { User } from '../../users/schemas/user.schema';
export type NoticeDocument = Notice & Document;
export declare class Notice {
    hospitalId: Hospital | Types.ObjectId;
    authorId: User | Types.ObjectId;
    title: string;
    message: string;
    status: string;
}
export declare const NoticeSchema: import("mongoose").Schema<Notice, import("mongoose").Model<Notice, any, any, any, any, any, Notice>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notice, Document<unknown, {}, Notice, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Notice & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    hospitalId?: import("mongoose").SchemaDefinitionProperty<Hospital | Types.ObjectId, Notice, Document<unknown, {}, Notice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notice & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    authorId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | User, Notice, Document<unknown, {}, Notice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notice & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Notice, Document<unknown, {}, Notice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notice & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    message?: import("mongoose").SchemaDefinitionProperty<string, Notice, Document<unknown, {}, Notice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notice & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Notice, Document<unknown, {}, Notice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notice & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Notice>;

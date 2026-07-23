import { Document, Types } from 'mongoose';
import { Hospital } from '../../hospitals/schemas/hospital.schema';
import { User } from '../../users/schemas/user.schema';
export type PatientDocument = Patient & Document;
export declare class Patient {
    hospitalId: Hospital | Types.ObjectId;
    uhid?: string;
    assignedDoctorId?: User | Types.ObjectId;
    name: string;
    mobile: string;
    age: number;
    gender: string;
    address: string;
    prakriti: string;
    medicalHistory: string[];
    chiefComplaints: string;
    diagnosis: string;
    prakritiToken?: string;
    prakritiScores?: {
        vata: number;
        pitta: number;
        kapha: number;
    };
}
export declare const PatientSchema: import("mongoose").Schema<Patient, import("mongoose").Model<Patient, any, any, any, any, any, Patient>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Patient, Document<unknown, {}, Patient, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    hospitalId?: import("mongoose").SchemaDefinitionProperty<Hospital | Types.ObjectId, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    uhid?: import("mongoose").SchemaDefinitionProperty<string | undefined, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    assignedDoctorId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | User | undefined, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    mobile?: import("mongoose").SchemaDefinitionProperty<string, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    age?: import("mongoose").SchemaDefinitionProperty<number, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    gender?: import("mongoose").SchemaDefinitionProperty<string, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    prakriti?: import("mongoose").SchemaDefinitionProperty<string, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    medicalHistory?: import("mongoose").SchemaDefinitionProperty<string[], Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    chiefComplaints?: import("mongoose").SchemaDefinitionProperty<string, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    diagnosis?: import("mongoose").SchemaDefinitionProperty<string, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    prakritiToken?: import("mongoose").SchemaDefinitionProperty<string | undefined, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    prakritiScores?: import("mongoose").SchemaDefinitionProperty<{
        vata: number;
        pitta: number;
        kapha: number;
    } | undefined, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Patient>;

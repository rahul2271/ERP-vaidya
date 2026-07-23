import { Document } from 'mongoose';
export type HospitalDocument = Hospital & Document;
export declare class Hospital {
    name: string;
    logo: string;
    tagline: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    gstNumber: string;
    registrationNumber: string;
    domain: string;
    plan: string;
    status: string;
    subscriptionExpiry: Date;
    subscriptionStatus: string;
    trialEndsAt: Date;
    planRenewsAt: Date;
    billingCycle: string;
    tallyConfig: {
        serverUrl: string;
        companyName: string;
        lastSyncedAt: Date;
        lastSyncStatus: string;
    };
    config: {
        startTime: string;
        endTime: string;
    };
    whatsappConfig: {
        accessToken: string;
        phoneId: string;
        businessAccountId: string;
        verifyToken: string;
    };
    smtpConfig: {
        host: string;
        port: number;
        user: string;
        pass: string;
        fromEmail: string;
        fromName: string;
    };
}
export declare const HospitalSchema: import("mongoose").Schema<Hospital, import("mongoose").Model<Hospital, any, any, any, any, any, Hospital>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Hospital, Document<unknown, {}, Hospital, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    logo?: import("mongoose").SchemaDefinitionProperty<string, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    tagline?: import("mongoose").SchemaDefinitionProperty<string, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    city?: import("mongoose").SchemaDefinitionProperty<string, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    state?: import("mongoose").SchemaDefinitionProperty<string, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    gstNumber?: import("mongoose").SchemaDefinitionProperty<string, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    registrationNumber?: import("mongoose").SchemaDefinitionProperty<string, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    domain?: import("mongoose").SchemaDefinitionProperty<string, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    plan?: import("mongoose").SchemaDefinitionProperty<string, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    subscriptionExpiry?: import("mongoose").SchemaDefinitionProperty<Date, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    subscriptionStatus?: import("mongoose").SchemaDefinitionProperty<string, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    trialEndsAt?: import("mongoose").SchemaDefinitionProperty<Date, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    planRenewsAt?: import("mongoose").SchemaDefinitionProperty<Date, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    billingCycle?: import("mongoose").SchemaDefinitionProperty<string, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    tallyConfig?: import("mongoose").SchemaDefinitionProperty<{
        serverUrl: string;
        companyName: string;
        lastSyncedAt: Date;
        lastSyncStatus: string;
    }, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    config?: import("mongoose").SchemaDefinitionProperty<{
        startTime: string;
        endTime: string;
    }, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    whatsappConfig?: import("mongoose").SchemaDefinitionProperty<{
        accessToken: string;
        phoneId: string;
        businessAccountId: string;
        verifyToken: string;
    }, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    smtpConfig?: import("mongoose").SchemaDefinitionProperty<{
        host: string;
        port: number;
        user: string;
        pass: string;
        fromEmail: string;
        fromName: string;
    }, Hospital, Document<unknown, {}, Hospital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Hospital>;

import { Document, Types } from 'mongoose';
export type BlogPostDocument = BlogPost & Document;
export declare class BlogPost {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    tags: string[];
    authorName: string;
    authorId: Types.ObjectId;
    published: boolean;
    publishedAt: Date;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
    viewCount: number;
}
export declare const BlogPostSchema: import("mongoose").Schema<BlogPost, import("mongoose").Model<BlogPost, any, any, any, any, any, BlogPost>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BlogPost, Document<unknown, {}, BlogPost, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<BlogPost & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    title?: import("mongoose").SchemaDefinitionProperty<string, BlogPost, Document<unknown, {}, BlogPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlogPost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    slug?: import("mongoose").SchemaDefinitionProperty<string, BlogPost, Document<unknown, {}, BlogPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlogPost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    excerpt?: import("mongoose").SchemaDefinitionProperty<string, BlogPost, Document<unknown, {}, BlogPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlogPost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    content?: import("mongoose").SchemaDefinitionProperty<string, BlogPost, Document<unknown, {}, BlogPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlogPost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    coverImage?: import("mongoose").SchemaDefinitionProperty<string, BlogPost, Document<unknown, {}, BlogPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlogPost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    tags?: import("mongoose").SchemaDefinitionProperty<string[], BlogPost, Document<unknown, {}, BlogPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlogPost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    authorName?: import("mongoose").SchemaDefinitionProperty<string, BlogPost, Document<unknown, {}, BlogPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlogPost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    authorId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, BlogPost, Document<unknown, {}, BlogPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlogPost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    published?: import("mongoose").SchemaDefinitionProperty<boolean, BlogPost, Document<unknown, {}, BlogPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlogPost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    publishedAt?: import("mongoose").SchemaDefinitionProperty<Date, BlogPost, Document<unknown, {}, BlogPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlogPost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    seoTitle?: import("mongoose").SchemaDefinitionProperty<string, BlogPost, Document<unknown, {}, BlogPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlogPost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    seoDescription?: import("mongoose").SchemaDefinitionProperty<string, BlogPost, Document<unknown, {}, BlogPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlogPost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    seoKeywords?: import("mongoose").SchemaDefinitionProperty<string[], BlogPost, Document<unknown, {}, BlogPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlogPost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    viewCount?: import("mongoose").SchemaDefinitionProperty<number, BlogPost, Document<unknown, {}, BlogPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlogPost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, BlogPost>;

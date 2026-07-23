import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BlogPostDocument = BlogPost & Document;

// Platform-level content (not per-hospital) — used for organic SEO growth via
// /blog. Only Super Admin can write/publish; anyone can read published posts.
@Schema({ timestamps: true })
export class BlogPost {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true })
  excerpt: string;

  @Prop({ required: true })
  content: string; // markdown

  @Prop({ type: String, default: null })
  coverImage: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  authorName: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  authorId: Types.ObjectId;

  @Prop({ default: false, index: true })
  published: boolean;

  @Prop({ type: Date, default: null })
  publishedAt: Date;

  // SEO overrides — fall back to title/excerpt if not set
  @Prop({ type: String, default: null })
  seoTitle: string;

  @Prop({ type: String, default: null })
  seoDescription: string;

  @Prop({ type: [String], default: [] })
  seoKeywords: string[];

  @Prop({ default: 0 })
  viewCount: number;
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);

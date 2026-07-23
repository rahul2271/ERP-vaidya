import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogPost, BlogPostDocument } from './schemas/blog-post.schema';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(BlogPost.name) private blogModel: Model<BlogPostDocument>,
  ) {}

  private slugify(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Public: only published posts, newest first
  async findPublished(tag?: string) {
    const query: any = { published: true };
    if (tag) query.tags = tag;
    return this.blogModel.find(query).sort({ publishedAt: -1 }).select('-content').exec();
  }

  async findBySlugPublic(slug: string) {
    const post = await this.blogModel.findOneAndUpdate(
      { slug, published: true },
      { $inc: { viewCount: 1 } },
      { new: true },
    ).exec();
    if (!post) throw new NotFoundException('Post not found.');
    return post;
  }

  // Admin: everything, including drafts
  async findAllForAdmin() {
    return this.blogModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOneForAdmin(id: string) {
    const post = await this.blogModel.findById(id).exec();
    if (!post) throw new NotFoundException('Post not found.');
    return post;
  }

  async create(dto: any, authorName: string, authorId: string) {
    let slug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.title);
    const existing = await this.blogModel.findOne({ slug }).exec();
    if (existing) {
      throw new ConflictException('A post with this slug already exists. Choose a different title or slug.');
    }

    const post = new this.blogModel({
      ...dto,
      slug,
      authorName,
      authorId,
      publishedAt: dto.published ? new Date() : null,
    });
    return post.save();
  }

  async update(id: string, dto: any) {
    const existing = await this.blogModel.findById(id).exec();
    if (!existing) throw new NotFoundException('Post not found.');

    const payload: any = { ...dto };
    if (dto.slug) payload.slug = this.slugify(dto.slug);

    // If flipping from draft to published for the first time, stamp the date.
    if (dto.published && !existing.published) {
      payload.publishedAt = new Date();
    }

    return this.blogModel.findByIdAndUpdate(id, payload, { new: true }).exec();
  }

  async remove(id: string) {
    const deleted = await this.blogModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Post not found.');
    return deleted;
  }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const blog_post_schema_1 = require("./schemas/blog-post.schema");
let BlogService = class BlogService {
    blogModel;
    constructor(blogModel) {
        this.blogModel = blogModel;
    }
    slugify(title) {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    async findPublished(tag) {
        const query = { published: true };
        if (tag)
            query.tags = tag;
        return this.blogModel.find(query).sort({ publishedAt: -1 }).select('-content').exec();
    }
    async findBySlugPublic(slug) {
        const post = await this.blogModel.findOneAndUpdate({ slug, published: true }, { $inc: { viewCount: 1 } }, { new: true }).exec();
        if (!post)
            throw new common_1.NotFoundException('Post not found.');
        return post;
    }
    async findAllForAdmin() {
        return this.blogModel.find().sort({ createdAt: -1 }).exec();
    }
    async findOneForAdmin(id) {
        const post = await this.blogModel.findById(id).exec();
        if (!post)
            throw new common_1.NotFoundException('Post not found.');
        return post;
    }
    async create(dto, authorName, authorId) {
        let slug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.title);
        const existing = await this.blogModel.findOne({ slug }).exec();
        if (existing) {
            throw new common_1.ConflictException('A post with this slug already exists. Choose a different title or slug.');
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
    async update(id, dto) {
        const existing = await this.blogModel.findById(id).exec();
        if (!existing)
            throw new common_1.NotFoundException('Post not found.');
        const payload = { ...dto };
        if (dto.slug)
            payload.slug = this.slugify(dto.slug);
        if (dto.published && !existing.published) {
            payload.publishedAt = new Date();
        }
        return this.blogModel.findByIdAndUpdate(id, payload, { new: true }).exec();
    }
    async remove(id) {
        const deleted = await this.blogModel.findByIdAndDelete(id).exec();
        if (!deleted)
            throw new common_1.NotFoundException('Post not found.');
        return deleted;
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(blog_post_schema_1.BlogPost.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BlogService);
//# sourceMappingURL=blog.service.js.map
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { BlogService } from './blog.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // ✅ Public — no guard. This is what search engines and readers hit.
  @Get()
  findPublished(@Query('tag') tag?: string) {
    return this.blogService.findPublished(tag);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlugPublic(slug);
  }

  // ✅ Admin-only — platform content, so Super Admin manages it, not per-hospital staff.
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('admin/all')
  findAllForAdmin() {
    return this.blogService.findAllForAdmin();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('admin/:id')
  findOneForAdmin(@Param('id') id: string) {
    return this.blogService.findOneForAdmin(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post()
  create(@Body() dto: any, @Request() req) {
    // req.user doesn't carry a display name (only userId/email/role/hospitalId),
    // so authorName is accepted from the form and falls back to the platform name.
    return this.blogService.create(dto, dto.authorName || 'VAIDYA ERP Team', req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.blogService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}

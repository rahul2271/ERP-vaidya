import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notice, NoticeDocument } from './schemas/notice.schema';

@Injectable()
export class NoticesService {
  constructor(@InjectModel(Notice.name) private noticeModel: Model<NoticeDocument>) {}

  // 1. CREATE NOTICE
  async create(createDto: any, user: any) {
    if (!user.hospitalId) throw new BadRequestException('Hospital ID required');
    
    // Smart Logic: Admins auto-publish. Everyone else goes to PENDING.
    const userRole = user.role?.toUpperCase();
    const initialStatus = ['ADMIN', 'SUPER_ADMIN'].includes(userRole) ? 'PUBLISHED' : 'PENDING';

    const newNotice = new this.noticeModel({
      ...createDto,
      authorId: user.userId,
      hospitalId: user.hospitalId,
      status: initialStatus,
    });
    
    return newNotice.save();
  }

  // 2. FETCH NOTICES BASED ON ROLE
  async findAll(user: any) {
    const query: any = { hospitalId: user.hospitalId };

    // If NOT an admin, they can ONLY see published notices
    if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role?.toUpperCase())) {
      query.status = 'PUBLISHED';
    }

    return this.noticeModel.find(query)
      .populate('authorId', 'name role') // Grabs the sender's name!
      .sort({ createdAt: -1 })
      .exec();
  }

  // 3. ADMIN APPROVAL/REJECTION
  async updateStatus(id: string, status: string, hospitalId: string) {
    const notice = await this.noticeModel.findOneAndUpdate(
      { _id: id, hospitalId },
      { status },
      { new: true, returnDocument: 'after' }
    ).exec();

    if (!notice) throw new NotFoundException('Notice not found');
    return notice;
  }

  // 4. ADMIN DELETE
  async remove(id: string, hospitalId: string) {
    const notice = await this.noticeModel.findOneAndDelete({ _id: id, hospitalId }).exec();
    if (!notice) throw new NotFoundException('Notice not found');
    return { success: true, message: 'Notice deleted successfully' };
  }
}
// import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Treatment, TreatmentDocument } from './schemas/treatment.schema';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// @Controller('treatments')
// export class TreatmentsController {
//   constructor(@InjectModel(Treatment.name) private treatmentModel: Model<TreatmentDocument>) {}

//   @UseGuards(JwtAuthGuard)
//   @Post()
//   async create(@Body() body: any, @Request() req) {
//     return new this.treatmentModel({ ...body, hospitalId: req.user.hospitalId }).save();
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get()
//   async findAll(@Request() req) {
//     return this.treatmentModel.find({ hospitalId: req.user.hospitalId, isActive: true }).exec();
//   }

//   @UseGuards(JwtAuthGuard)
//   @Patch(':id')
//   async update(@Param('id') id: string, @Body() body: any) {
//     return this.treatmentModel.findByIdAndUpdate(id, body, { new: true });
//   }

//   @UseGuards(JwtAuthGuard)
//   @Delete(':id')
//   async remove(@Param('id') id: string) {
//     return this.treatmentModel.findByIdAndUpdate(id, { isActive: false });
//   }
// }


import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { TreatmentsService } from './treatments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('treatments') // ✅ This must match the frontend URL
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: any, @Request() req) {
    return this.treatmentsService.create(body, req.user.hospitalId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    return this.treatmentsService.findAll(req.user.hospitalId);
  }
}
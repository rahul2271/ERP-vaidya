// import { Injectable } from '@nestjs/common';
// import { CreateRoomDto } from './dto/create-room.dto';
// import { UpdateRoomDto } from './dto/update-room.dto';

// @Injectable()
// export class RoomsService {
//   create(createRoomDto: CreateRoomDto) {
//     return 'This action adds a new room';
//   }

//   findAll() {
//     return `This action returns all rooms`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} room`;
//   }

//   update(id: number, updateRoomDto: UpdateRoomDto) {
//     return `This action updates a #${id} room`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} room`;
//   }
// }


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async create(createRoomDto: CreateRoomDto) {
    const createdRoom = new this.roomModel(createRoomDto);
    return createdRoom.save();
  }

  async findAll() {
    return this.roomModel.find().exec();
  }

  async findOne(id: string) {
    const room = await this.roomModel.findById(id).exec();
    if (!room) throw new NotFoundException(`Room #${id} not found`);
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    return this.roomModel.findByIdAndUpdate(id, updateRoomDto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.roomModel.findByIdAndDelete(id).exec();
  }
}
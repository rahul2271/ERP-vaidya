// import { Module } from '@nestjs/common';
// import { RoomsService } from './rooms.service';
// import { RoomsController } from './rooms.controller';

// @Module({
//   controllers: [RoomsController],
//   providers: [RoomsService],
// })
// export class RoomsModule {}


// src/rooms/rooms.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room, RoomSchema } from './schemas/room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [MongooseModule], // <--- Exporting for Seed script
})
export class RoomsModule {}
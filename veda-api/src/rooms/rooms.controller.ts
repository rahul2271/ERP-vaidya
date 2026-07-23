// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { RoomsService } from './rooms.service';
// import { CreateRoomDto } from './dto/create-room.dto';
// import { UpdateRoomDto } from './dto/update-room.dto';

// @Controller('rooms')
// export class RoomsController {
//   constructor(private readonly roomsService: RoomsService) {}

//   @Post()
//   create(@Body() createRoomDto: CreateRoomDto) {
//     return this.roomsService.create(createRoomDto);
//   }

//   @Get()
//   findAll() {
//     return this.roomsService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.roomsService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
//     return this.roomsService.update(+id, updateRoomDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.roomsService.remove(+id);
//   }
// }


import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

// 🚀 Import your Guard (Verify this path matches where your guard actually is!)
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // 🚀 The Guard acts as the "Bouncer", checking the login token
  @UseGuards(JwtAuthGuard) 
  @Post()
  create(@Body() createRoomDto: CreateRoomDto, @Request() req) {
    
    // 🚀 Automatically attach the Admin's hospitalId to the new room!
    const roomData = {
      ...createRoomDto,
      hospitalId: req.user.hospitalId,
    };

    return this.roomsService.create(roomData);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
}

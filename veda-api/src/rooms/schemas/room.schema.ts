// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// export type RoomDocument = Room & Document;

// @Schema({ timestamps: true })
// export class Room {
//   @Prop({ type: Types.ObjectId, ref: 'Hospital', required: true })
//   hospitalId: Types.ObjectId;

//   @Prop({ required: true })
//   name: string; // "Therapy Room 1"

//   @Prop({ required: true, enum: ['WET', 'DRY', 'CONSULTATION'] })
//   type: string;

//   @Prop([String])
//   equipment: string[]; // ["Steam Box", "Droni Table"]

//   @Prop({ default: 'AVAILABLE', enum: ['AVAILABLE', 'MAINTENANCE'] })
//   status: string;
// }

// export const RoomSchema = SchemaFactory.createForClass(Room);


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
  @Prop({ type: Types.ObjectId, ref: 'Hospital', required: true })
  hospitalId: Types.ObjectId;

  @Prop({ required: true })
  name: string; // e.g., "Room 101", "ICU-A"

  // 🚀 FIX 1: Expanded the enum to accept all the options from your frontend dropdown
  @Prop({ 
    required: true, 
    enum: ['WET', 'DRY', 'CONSULTATION', 'THERAPY', 'GENERAL_WARD', 'PRIVATE_WARD', 'ICU'] 
  })
  type: string;

  // 🚀 FIX 2: Added the capacity field so Mongoose knows how to save it
  @Prop({ required: true, default: 1 })
  capacity: number;

  @Prop([String])
  equipment: string[]; // ["Steam Box", "Droni Table"]

  @Prop({ default: 'AVAILABLE', enum: ['AVAILABLE', 'MAINTENANCE'] })
  status: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
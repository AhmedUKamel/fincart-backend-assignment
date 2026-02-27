import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ShipmentDocument = HydratedDocument<ShipmentEntity>;

@Schema({ timestamps: true })
export class ShipmentEntity {
  @Prop({ required: true })
  declare public readonly orderId: string;

  @Prop({ required: true })
  declare public readonly status: string;

  @Prop({ required: true })
  declare public readonly courier: string;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export const ShipmentSchema = SchemaFactory.createForClass(ShipmentEntity);

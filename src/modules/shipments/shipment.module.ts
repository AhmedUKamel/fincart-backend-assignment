import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShipmentProviders } from './shipment.providers';
import { ShipmentEntity, ShipmentSchema } from './infrastructure';
import {
  CreateShipmentHandler,
  UpdateShipmentStatusHandler,
} from './application';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShipmentEntity.name, schema: ShipmentSchema },
    ]),
  ],
  providers: [
    ShipmentProviders.SHIPMENT_REPOSITORY,

    CreateShipmentHandler,
    UpdateShipmentStatusHandler,
  ],
})
export class ShipmentModule {}

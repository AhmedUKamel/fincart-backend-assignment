import { Module } from '@nestjs/common';
import { ShipmentProviders } from './shipment.providers';
import { UpdateShipmentStatusHandler } from './application';

@Module({
  providers: [
    ShipmentProviders.SHIPMENT_REPOSITORY,

    UpdateShipmentStatusHandler,
  ],
})
export class ShipmentModule {}

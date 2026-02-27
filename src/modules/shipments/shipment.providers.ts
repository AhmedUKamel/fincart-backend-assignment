import { ShipmentTokens } from './shipment.tokens';
import { ShipmentRepository } from './infrastructure';

export const ShipmentProviders = {
  SHIPMENT_REPOSITORY: {
    provide: ShipmentTokens.SHIPMENT_REPOSITORY,
    useClass: ShipmentRepository,
  },
};

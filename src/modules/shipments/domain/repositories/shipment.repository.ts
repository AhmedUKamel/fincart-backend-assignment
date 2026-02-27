import { Shipment } from '../entities/shipment.entity';

export type ShipmentCreate = Pick<Shipment, 'orderId' | 'status' | 'courier'>;

export type ShipmentUpdate = Partial<Pick<Shipment, 'status' | 'courier'>>;

export interface IShipmentRepository {
  createOne(input: ShipmentCreate): Promise<void>;
  updateOneById(id: string, changes: ShipmentUpdate): Promise<boolean>;
}

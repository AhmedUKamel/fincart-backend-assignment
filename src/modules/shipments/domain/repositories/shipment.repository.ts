import { Shipment } from '../entities/shipment.entity';

export type ShipmentUpdate = Partial<Pick<Shipment, 'status' | 'courier'>>;

export interface IShipmentRepository {
  updateOneById(id: string, changes: ShipmentUpdate): Promise<boolean>;
}

import { IShipmentRepository, ShipmentUpdate } from '../../../domain';

export class ShipmentRepository implements IShipmentRepository {
  public async updateOneById(
    _id: string,
    _changes: ShipmentUpdate,
  ): Promise<boolean> {
    // TODO: update this
    return true;
  }
}

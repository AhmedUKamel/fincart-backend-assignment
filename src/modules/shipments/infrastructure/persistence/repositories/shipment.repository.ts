import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ShipmentDocument, ShipmentEntity } from '../schemas/shipment.schema';
import {
  ShipmentCreate,
  ShipmentUpdate,
  IShipmentRepository,
} from '../../../domain';

export class ShipmentRepository implements IShipmentRepository {
  public constructor(
    @InjectModel(ShipmentEntity.name)
    private shipmentModel: Model<ShipmentDocument>,
  ) {}

  public async createOne(input: ShipmentCreate): Promise<void> {
    await this.shipmentModel.create(input);
  }

  public async updateOneById(
    id: string,
    changes: ShipmentUpdate,
  ): Promise<boolean> {
    const { modifiedCount } = await this.shipmentModel.updateOne(
      { _id: id },
      changes,
    );

    return modifiedCount === 1;
  }
}

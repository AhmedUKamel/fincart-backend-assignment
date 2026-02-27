import * as Joi from 'joi';
import { EventDto } from 'src/modules/ingestion/domain';
import { ShipmentTokens } from '../../shipment.tokens';
import { IShipmentRepository } from '../../domain';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventHandler, IEventHandler } from 'src/modules/common';

interface UpdateShipmentStatusUow {
  readonly shipmentId: string;
  readonly status: string;
}

@Injectable()
@EventHandler('UPDATE_SHIPMENT_STATUS')
export class UpdateShipmentStatusHandler implements IEventHandler<EventDto> {
  private readonly logger = new Logger(UpdateShipmentStatusHandler.name);
  private readonly validationSchema = Joi.object<UpdateShipmentStatusUow>({
    shipmentId: Joi.string().uuid({ version: 'uuidv4' }).required(),
    status: Joi.string().trim().lowercase().min(3).required(),
  });

  public constructor(
    @Inject(ShipmentTokens.SHIPMENT_REPOSITORY)
    private readonly repository: IShipmentRepository,
  ) {}

  public async handle(event: EventDto): Promise<void> {
    const { shipmentId, status } = this.validateAndGetValue(event.payload);

    const isUpdated = await this.repository.updateOneById(shipmentId, {
      status,
    });

    if (!isUpdated) {
      this.logger.error(
        `Failed to update shipment with ID '${shipmentId}' to status '${status}': Shipment not found`,
      );

      throw new Error('Shipment not found');
    }
  }

  private validateAndGetValue(payload: unknown): UpdateShipmentStatusUow {
    const { value, error } = this.validationSchema.validate(payload, {
      convert: true,
    });

    if (error !== undefined) {
      throw new Error(
        `Invalid payload to update shipment status: ${error.message}`,
      );
    }

    return value;
  }
}

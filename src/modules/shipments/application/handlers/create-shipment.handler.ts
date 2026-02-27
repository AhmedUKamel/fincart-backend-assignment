import * as Joi from 'joi';
import { EventDto } from 'src/modules/ingestion/domain';
import { ShipmentTokens } from '../../shipment.tokens';
import { Inject, Injectable } from '@nestjs/common';
import { IShipmentRepository } from '../../domain';
import { EventHandler, IEventHandler } from 'src/modules/common';

interface CreateShipmentUow {
  readonly orderId: string;
  readonly status: string;
  readonly courier: string;
}

@Injectable()
@EventHandler('CREATE_SHIPMENT')
export class CreateShipmentHandler implements IEventHandler<EventDto> {
  private readonly validationSchema = Joi.object<CreateShipmentUow>({
    orderId: Joi.string().uuid({ version: 'uuidv4' }).required(),
    status: Joi.string().trim().lowercase().min(3).required(),
    courier: Joi.string().trim().lowercase().min(3).required(),
  });

  public constructor(
    @Inject(ShipmentTokens.SHIPMENT_REPOSITORY)
    private readonly repository: IShipmentRepository,
  ) {}

  public async handle(event: EventDto): Promise<void> {
    const { orderId, status, courier } = this.validateAndGetValue(
      event.payload,
    );

    await this.repository.createOne({
      orderId,
      status,
      courier,
    });
  }

  private validateAndGetValue(payload: unknown): CreateShipmentUow {
    const { value, error } = this.validationSchema.validate(payload, {
      convert: true,
    });

    if (error !== undefined) {
      throw new Error(`Invalid payload to create shipment: ${error.message}`);
    }

    return value;
  }
}

import {
  IsUUID,
  IsObject,
  IsISO8601,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { EventDto } from 'src/modules/ingestion/domain';

export class EventRequest implements EventDto {
  @IsUUID()
  declare public readonly id: string;

  @IsNotEmpty()
  @MinLength(10)
  declare public readonly type: string;

  @IsISO8601()
  declare public readonly timestamp: Date;

  @IsNotEmpty()
  @IsObject()
  declare public readonly payload: Record<string, unknown>;
}

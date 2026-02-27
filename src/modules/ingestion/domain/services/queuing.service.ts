import { EventDto } from '../dto/event.dto';

export interface IQueueService {
  enqueue(event: EventDto): Promise<void>;
}

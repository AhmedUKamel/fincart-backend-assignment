import { SetMetadata } from '@nestjs/common';

export const EVENT_HANDLER_KEY = 'metadata:event:handler';
export const EventHandler = (type: string) =>
  SetMetadata(EVENT_HANDLER_KEY, type);

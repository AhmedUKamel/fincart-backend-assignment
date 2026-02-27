import { EventDto } from 'src/modules/ingestion/domain';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EVENT_HANDLER_KEY, IEventHandler } from 'src/modules/common';

@Injectable()
export class EventService implements OnModuleInit {
  private readonly logger = new Logger(EventService.name);
  private readonly handlerMap = new Map<string, IEventHandler<EventDto>>();

  public constructor(
    private readonly reflector: Reflector,
    private readonly discoveryService: DiscoveryService,
  ) {}

  public onModuleInit(): void {
    const providers = this.discoveryService.getProviders();

    for (const provider of providers) {
      const { instance, metatype } = provider;
      if (!instance || !metatype) {
        continue;
      }

      const eventType = this.reflector.get<string>(EVENT_HANDLER_KEY, metatype);
      if (!eventType) {
        continue;
      }

      if (this.handlerMap.has(eventType)) {
        this.logger.warn(`Overriding handler for event '${eventType}'`);
      }

      this.handlerMap.set(eventType, instance);

      this.logger.log(`Registered handler for event '${eventType}'`);
    }
  }

  public async handle(event: EventDto): Promise<void> {
    const handler = this.getHandler(event.type);

    await handler.handle(event);
  }

  private getHandler(type: string): IEventHandler<EventDto> {
    const handler = this.handlerMap.get(type);

    if (handler === undefined) {
      throw new Error(`No handler found for event '${type}'`);
    }

    return handler;
  }
}

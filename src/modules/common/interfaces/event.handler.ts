export interface IEventHandler<TEvent, TResult = void> {
  handle(event: TEvent): Promise<TResult>;
}

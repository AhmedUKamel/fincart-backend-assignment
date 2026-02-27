export interface EventDto {
  readonly id: string;
  readonly type: string;
  readonly timestamp: Date;
  readonly payload: Record<string, unknown>;
}

export class ApiResponse<T = unknown> {
  public readonly timestamp = new Date().toISOString();

  public constructor(
    public readonly success: boolean = true,
    public readonly message: string = '',
    public readonly data: T | null = null,
  ) {}

  public static success(): ApiResponse;
  public static success(message: string): ApiResponse;
  public static success<T>(message: string, data: T): ApiResponse<T>;
  public static success<T>(message?: string, data?: T): ApiResponse<T> {
    return new ApiResponse(true, message, data);
  }
}

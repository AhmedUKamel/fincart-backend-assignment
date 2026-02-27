export class Shipment {
  public constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly status: string,
    public readonly courier: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

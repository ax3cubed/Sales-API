import { ApiLogger } from "./api-logger";

export class ApiError<T> extends Error {
  private logger: ApiLogger<T>;

  constructor(message: string, public entity: T, public originalError?: any) {
    super(message);
    this.name = this.constructor.name;
    this.logger = new ApiLogger<T>(entity);
    this.logger.logError(message, originalError);
  }
}
import { logger } from "../config/logger/logger.config";
import { getEntityName } from "../utils/utils";


export class ApiLogger<T> {
    private entityName: string;
  
    constructor(entity: T) {
      this.entityName = getEntityName(entity);
    }

  
    logError(message: string, error?: any) {
      logger.error(`[${this.entityName}] ${message}`, error);
    }
  
    logInfo(message: string) {
      logger.info(`[${this.entityName}] ${message}`);
    }
  }
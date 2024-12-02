import { getEntityName } from "./utils";

// messages.ts
export class Messages<T> {
    private entityName: string;
  
    constructor(entity: T) {
      this.entityName = getEntityName(entity);
    }
  
   
  
    FETCH_SUCCESS = "Data retrieved successfully";
    FETCH_ERROR = "Data retrieval failed";
    NOT_FOUND = () => `${this.entityName} not found.`;
    CREATE_SUCCESS = () => `${this.entityName} created successfully`;
    UPDATE_SUCCESS = () => `${this.entityName} updated successfully`;
    DELETE_SUCCESS = () => `${this.entityName} deleted successfully`;
  
    UNABLE_TO_FIND_ENTITY = (id: any, error: any) => `Unable to find ${this.entityName} with ID ${id}: ${error.message}`;
    UNABLE_TO_RETRIEVE_ENTITY = (error: any) => `Unable to retrieve ${this.entityName}s: ${error.message}`;
    UNABLE_TO_CREATE_ENTITY = (error: any) => `Unable to create ${this.entityName}: ${error.message}`;
    ENTITY_ID_REQUIRED_TO_UPDATE = () => `${this.entityName} ID is required to update the user.`;
    UNABLE_TO_UPDATE_ENTITY = (id: any, error: any) => `Unable to update ${this.entityName} with ID ${id}: ${error.message}`;
    ENTITY_ID_REQUIRED_TO_DELETE = () => `${this.entityName} ID is required to delete the user.`;
    NO_ENTITY_FOUND_TO_DELETE = (id: any) => `No ${this.entityName} found with ID ${id} to delete.`;
    UNABLE_TO_DELETE_ENTITY = (id: any, error: any) => `Unable to delete ${this.entityName} with ID ${id}: ${error.message}`;

    ENTITY_VALIDATION_FAILED= () => `${this.entityName} validation failed`
    INVALID_ENTITY_DATA = () =>`Invalid ${this.entityName} data`
    
  }
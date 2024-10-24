// GLOBAL
export const FETCH_SUCCESS = `Data retrived sucessfully`;
export const FETCH_ERROR =`Data retrieval failed `;
export const NOT_FOUND = (Object: any) => `${Object.name}  not found.`;
export const CREATE_SUCCESS = (Object: any) => `${Object.name} Created Sucessfully`;
export const UPDATE_SUCCESS = (Object: any) => `${Object.name} Update Sucessfully`;
export const DELETE_SUCCESS = (Object: any) => `${Object.name} DELETE Sucessfully`;


// USER SERVICE
export const UNABLE_TO_FIND_USER = (id:any, error:any) => `Unable to find user with ID ${id}: ${error.message}`

// PRODUCT SERVICE
export const UNABLE_TO_FIND_PRODUCT = (id:any, error:any) => `Unable to find product with ID ${id}: ${error.message}`
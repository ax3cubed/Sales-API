// utils.ts
export function getEntityName<T>(entity: T): string {
  if (entity === null || entity === undefined) {
    return "Unknown Entity";
  }
  return (entity as any).constructor.name;
}


export const mergeRecordObjects =(...objects: Record<number, any>[]) =>{
  return Object.assign({}, ...objects);
}
import crypto from 'crypto';

export const  generateOrderNumber = (user_id: string): string => {
 
  const timestamp = Date.now().toString();
  const input = `${user_id}-${timestamp}`;
  const hash = crypto.createHash("sha256").update(input).digest("hex");
  return `ORD-${BigInt(`0x${hash}`).toString(36).toUpperCase().substring(0, 10)}`;
 
}

 
 
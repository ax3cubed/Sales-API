// utils.ts
export function getEntityName<T>(entity: T): string {
  if (entity === null || entity === undefined) {
    return "Unknown Entity";
  }
  return (entity as any).constructor.name;
}
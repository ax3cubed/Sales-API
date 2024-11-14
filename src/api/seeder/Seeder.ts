import { ApiLogger } from '@/common/dtos/api-logger';
export class Seeder<T> implements ISeeder<T>{

    private logger : ApiLogger<Seeder<T>>
    constructor( private generateItem:() => T,
    private createInService: (item:T) => void){
        this.logger = new ApiLogger(this);
    };
    public async seed(count: number): Promise<void> {
        for (let index = 0; index < count; index++) {
            const item = this.generateItem();
            this.createInService(item);
            this.logger.logInfo(`Seeded ${count} items`)
            
        }
    }
    
}

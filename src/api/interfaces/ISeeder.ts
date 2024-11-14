interface ISeeder<T>{
    seed(count:number) : Promise<void>;
}
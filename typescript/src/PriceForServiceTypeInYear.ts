import { ServiceType } from "./ServiceType";
import { ServiceYear } from "./ServiceYear";


export class PriceForServiceTypeInYear {
    public year: ServiceYear;
    public service: ServiceType;
    public price: number;
    constructor(
        public currentYear: ServiceYear,
        public currentService: ServiceType,
        public currentPrice: number
    ) {
        this.year = currentYear;
        this.service = currentService;
        this.price = currentPrice;
    }
}

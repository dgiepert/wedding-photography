import { PriceForServiceTypeInYear } from "./PriceForServiceTypeInYear";


export interface IPricesForServiceService {
    GetPricesForServices: () => Array<PriceForServiceTypeInYear>;
}

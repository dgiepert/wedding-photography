import { PriceForServiceTypeInYear } from "./PriceForServiceTypeInYear";
import { ServiceType } from "./ServiceType";
import { ServiceYear } from "./ServiceYear";


export interface IPricesForServiceInYears {
    GetServicePriceForYear(serviceType: ServiceType, year: ServiceYear): PriceForServiceTypeInYear;
    GetServicesPricesForYear(year: ServiceYear): PriceForServiceTypeInYear[];
}

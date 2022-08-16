import { ServiceType } from "./ServiceType";
import { ServiceYear } from "./ServiceYear";


export interface IPossibleOperationsForServices {
    RemoveNonsensServicesFromCalculations(selectedServices: ServiceType[]): ServiceType[];
    GetServicesSummaryPriceWithAndWithoutDiscouts(selectedServices: ServiceType[], selectedYear: ServiceYear): { basePrice: number; finalPrice: number; };
}

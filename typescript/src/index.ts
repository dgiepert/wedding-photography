import "reflect-metadata";
import { container } from 'tsyringe';
import { PossibleOperationsForServices } from "./PossibleOperationsForServices";
import { ServiceYear } from "./ServiceYear";
import { ServiceType } from "./ServiceType";
import PricesForServiceService from "./PricesForServiceService";
import PricesForServiceInYears from "./PricesForServiceInYears";

container.register('IPricesForServiceService', {
    useClass: PricesForServiceService
});
container.register('IPricesForServiceInYears', {
    useClass: PricesForServiceInYears
});
container.register('IPossibleOperationsForServices', {
    useClass: PossibleOperationsForServices
});

export const possibleOperationsForServices = container.resolve(PossibleOperationsForServices);

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
) => { 
    let newSelection = action.type === "Select" ? [...previouslySelectedServices.filter(x => x !== action.service), action.service] : [...previouslySelectedServices.filter(x => x !== action.service)];
    return possibleOperationsForServices.RemoveNonsensServicesFromCalculations(newSelection);
}

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => { 
    return possibleOperationsForServices.GetServicesSummaryPriceWithAndWithoutDiscouts(selectedServices, selectedYear);
};
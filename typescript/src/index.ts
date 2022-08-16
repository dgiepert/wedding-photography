import "reflect-metadata";
import container from './di';
import { ServiceYear } from "./ServiceYear";
import { ServiceType } from "./ServiceType";
import { PossibleOperationsForServices } from "./PossibleOperationsForServices";

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
) => { 
    let newSelection = action.type === "Select" ? [...previouslySelectedServices.filter(x => x !== action.service), action.service] : [...previouslySelectedServices.filter(x => x !== action.service)];
    return container.resolve(PossibleOperationsForServices).RemoveNonsensServicesFromCalculations(newSelection);
}

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => { 
    return container.resolve(PossibleOperationsForServices).GetServicesSummaryPriceWithAndWithoutDiscouts(selectedServices, selectedYear);
};
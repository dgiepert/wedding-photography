import { ServiceType } from "./ServiceType";
import { ServiceYear } from "./ServiceYear";
import { PriceForServiceTypeInYear } from "./PriceForServiceTypeInYear";
import { injectable, inject } from 'tsyringe';
import { IPricesForServiceInYears } from "./IPricesForServiceInYears";
import { IPossibleOperationsForServices } from "./IPossibleOperationsForServices";

@injectable()
export class PossibleOperationsForServices implements IPossibleOperationsForServices {

    constructor(@inject('IPricesForServiceInYears') private _pricesForServices: IPricesForServiceInYears) {
    }

    private weddingSessionWithPhotoDiscount: ServiceType[] = ["Photography", "WeddingSession"];
    private weddingSessionWithVideoDiscount: ServiceType[] = ["VideoRecording", "WeddingSession"];
    private photoAndVideoDiscount: ServiceType[] = ["Photography", "VideoRecording"];

    private servicesContainsAllSelectedServices(arr: ServiceType[], arr2: ServiceType[]) {
        return arr.every(i => arr2.includes(i));
    }

    private servicesContainsAnyOfSelectedServices(arr: ServiceType[], arr2: ServiceType[]) {
        return arr.some(i => arr2.includes(i));
    }

    private getDiscounts(selectedServices: ServiceType[], selectedYear: ServiceYear) {
        let possibleDiscounts: Array<number> = [0];
        const discountForPhotoWithVideoService = this.servicesContainsAllSelectedServices(this.photoAndVideoDiscount, selectedServices);
        const discountForWeddingSessionWithPhoto = this.servicesContainsAllSelectedServices(this.weddingSessionWithPhotoDiscount, selectedServices);
        const discountForWeddingSessionWithVideo = this.servicesContainsAllSelectedServices(this.weddingSessionWithVideoDiscount, selectedServices);
        if (discountForPhotoWithVideoService) {
            switch (selectedYear) {
                case 2020:
                    possibleDiscounts.push(1200); //(2*$1700)-$2200
                    break;
                case 2021:
                    possibleDiscounts.push(1300); //(2*$1800)-$2300
                    break;
                case 2022:
                    possibleDiscounts.push(1300); //(2*$1900)-$2500
                    break;
            }
        }
        if (selectedYear === 2022 && discountForWeddingSessionWithPhoto) {
            possibleDiscounts.push(600);
        }
        else if (discountForWeddingSessionWithPhoto || discountForWeddingSessionWithVideo) {
            possibleDiscounts.push(300);
        }

        return possibleDiscounts.reduce((partialSum, a) => partialSum + a, 0);
    }

    public RemoveNonsensServicesFromCalculations(selectedServices: ServiceType[]): ServiceType[] {
        let finalServicesInCalculation = [...selectedServices];
        const containsBlueRayPackageService = this.servicesContainsAllSelectedServices(["BlurayPackage"], selectedServices);
        const containsPhotoOrVideoService = this.servicesContainsAnyOfSelectedServices(["Photography", "VideoRecording"], selectedServices);
        const containsVideoService = this.servicesContainsAllSelectedServices(["VideoRecording"], selectedServices);
        const containsTwoDayEventService = this.servicesContainsAllSelectedServices(["TwoDayEvent"], selectedServices);
        if (containsBlueRayPackageService && !containsVideoService) {
            finalServicesInCalculation = finalServicesInCalculation.filter(x => x != "BlurayPackage");
        }
        if (containsTwoDayEventService && !containsPhotoOrVideoService) {
            finalServicesInCalculation = finalServicesInCalculation.filter(x => x != "TwoDayEvent");
        }
        return finalServicesInCalculation;
    }

    private calculateSummaryPrice(selectedServices: ServiceType[], pricesForServices: PriceForServiceTypeInYear[]) {
        let price = 0;

        selectedServices.forEach(service => {
            const priceWithService = pricesForServices.find(serviceWithPrice => serviceWithPrice.service === service);
            if (priceWithService !== undefined) {
                price += priceWithService.price;
            }
            else {
                throw new Error("Price for service doesn't exisits for selected year");
            }
        });

        return price;
    }

    public GetServicesSummaryPriceWithAndWithoutDiscouts(selectedServices: ServiceType[], selectedYear: ServiceYear): { basePrice: number; finalPrice: number; } {
        var pricesForServicesInSelectedYear = this._pricesForServices.GetServicesPricesForYear(selectedYear);
        const finalServicesSelectionForCalculation = this.RemoveNonsensServicesFromCalculations(selectedServices);
        const priceWithoutDiscounts = this.calculateSummaryPrice(finalServicesSelectionForCalculation, pricesForServicesInSelectedYear);
        const discount = this.getDiscounts(finalServicesSelectionForCalculation, selectedYear);
        return { basePrice: priceWithoutDiscounts, finalPrice: priceWithoutDiscounts - discount };
    }
}

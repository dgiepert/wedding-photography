export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

export class PriceForServiceTypeInYear{
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

export class PricesForServiceInYears{

    public pricesForServices: Array<PriceForServiceTypeInYear>;

    constructor(){
        this.pricesForServices = [
            new PriceForServiceTypeInYear(2020, "Photography", 1700),
            new PriceForServiceTypeInYear(2021, "Photography", 1800),
            new PriceForServiceTypeInYear(2022, "Photography", 1900),
            new PriceForServiceTypeInYear(2020, "VideoRecording", 1700),
            new PriceForServiceTypeInYear(2021, "VideoRecording", 1800),
            new PriceForServiceTypeInYear(2022, "VideoRecording", 1900),
            new PriceForServiceTypeInYear(2020, "WeddingSession", 600),
            new PriceForServiceTypeInYear(2021, "WeddingSession", 600),
            new PriceForServiceTypeInYear(2022, "WeddingSession", 600),
            new PriceForServiceTypeInYear(2020, "BlurayPackage", 300),
            new PriceForServiceTypeInYear(2021, "BlurayPackage", 300),
            new PriceForServiceTypeInYear(2022, "BlurayPackage", 300),
            new PriceForServiceTypeInYear(2020, "TwoDayEvent", 400),
            new PriceForServiceTypeInYear(2021, "TwoDayEvent", 400),
            new PriceForServiceTypeInYear(2022, "TwoDayEvent", 400),
        ]
    }

    private getDistinctItemsFromArray<Type>(list: Array<Type>){
        return list.filter((x, i, a) => a.indexOf(x) == i);
    }

    public getServicePriceForYear(serviceType: ServiceType, year: ServiceYear) {
        const avaliableYears = this.getDistinctItemsFromArray(this.pricesForServices.map(x => x.year));
        const avaliableSerivces = this.getDistinctItemsFromArray((this.pricesForServices.map(x => x.service)));
        if(avaliableYears.indexOf(year) < 0){ 
            throw new Error("This year is not available in services prices list.");
        };
        if(avaliableSerivces.indexOf(serviceType) < 0){ 
            throw new Error("No service for selected year.");
        };
        return this.pricesForServices.find(x => x.year === year && x.service == serviceType);
    }

    public getServicesPricesForYear(year: ServiceYear) {
        const avaliableYears = this.getDistinctItemsFromArray(this.pricesForServices.map(x => x.year));
        if(avaliableYears.indexOf(year) < 0){ 
            throw new Error("This year is not available in services prices list.");
        };
        return this.pricesForServices.filter(x => x.year === year);
    }
}

export class PossibleOperationsForServices{

    private pricesForServices = new PricesForServiceInYears();

    constructor(){
    }

    private weddingSessionWithPhotoDiscount: ServiceType[] = ["Photography", "WeddingSession"];
    private weddingSessionWithVideoDiscount: ServiceType[] = ["VideoRecording", "WeddingSession"];
    private photoAndVideoDiscount: ServiceType[] = ["Photography", "VideoRecording"];

    private servicesContainsAllSelectedServices(arr: ServiceType[], arr2: ServiceType[]){
        return arr.every(i => arr2.includes(i));
    }

    private servicesContainsAnyOfSelectedServices(arr: ServiceType[], arr2: ServiceType[]){
        return arr.some(i => arr2.includes(i));
    }

    private getDiscounts(selectedServices: ServiceType[], selectedYear: ServiceYear){
        let possibleDiscounts: Array<number> = [0];
        const discountForPhotoWithVideoService = this.servicesContainsAllSelectedServices(this.photoAndVideoDiscount, selectedServices);
        const discountForWeddingSessionWithPhoto = this.servicesContainsAllSelectedServices(this.weddingSessionWithPhotoDiscount, selectedServices);
        const discountForWeddingSessionWithVideo = this.servicesContainsAllSelectedServices(this.weddingSessionWithVideoDiscount, selectedServices);        
        if(discountForPhotoWithVideoService){
            switch(selectedYear){
                case 2020:
                    possibleDiscounts.push(1200);//(2*$1700)-$2200
                    break;
                case 2021:
                    possibleDiscounts.push(1300);//(2*$1800)-$2300
                    break;
                case 2022:
                    possibleDiscounts.push(1300);//(2*$1900)-$2500
                    break;
            }
        }
        if(selectedYear === 2022 && discountForWeddingSessionWithPhoto){
            possibleDiscounts.push(600);
        }
        else if(discountForWeddingSessionWithPhoto || discountForWeddingSessionWithVideo){
            possibleDiscounts.push(300);
        }
        
        return possibleDiscounts.reduce((partialSum, a) => partialSum + a, 0)
    }

    public removeNonsensServicesFromCalculations(selectedServices: ServiceType[]): ServiceType[]{
        let finalServicesInCalculation = [...selectedServices];
        const containsBlueRayPackageService = this.servicesContainsAllSelectedServices(["BlurayPackage"], selectedServices);
        const containsPhotoOrVideoService = this.servicesContainsAnyOfSelectedServices(["Photography", "VideoRecording"],selectedServices);
        const containsVideoService = this.servicesContainsAllSelectedServices(["VideoRecording"],selectedServices);
        const containsTwoDayEventService = this.servicesContainsAllSelectedServices(["TwoDayEvent"],selectedServices);
        if(containsBlueRayPackageService && !containsVideoService){
            finalServicesInCalculation = finalServicesInCalculation.filter(x => x != "BlurayPackage");
        }
        if(containsTwoDayEventService && !containsPhotoOrVideoService){
            finalServicesInCalculation = finalServicesInCalculation.filter(x => x != "TwoDayEvent");
        }
        return finalServicesInCalculation;
    }

    private calculateSummaryPrice(selectedServices: ServiceType[], pricesForServices: PriceForServiceTypeInYear[]){
        let price = 0;

        selectedServices.forEach(service => {
            const priceWithService = pricesForServices.find(serviceWithPrice => serviceWithPrice.service === service);
            if(priceWithService !== undefined){
                price += priceWithService.price;
            }
            else{
                throw new Error("Price for service doesn't exisits for selected year");
            }
        });

        return price;
    }

    public getServicesSummaryPriceWithAndWithoutDiscouts(selectedServices: ServiceType[], selectedYear: ServiceYear): { basePrice: number, finalPrice: number }{
        var pricesForServicesInSelectedYear = this.pricesForServices.getServicesPricesForYear(selectedYear);
        const finalServicesSelectionForCalculation = this.removeNonsensServicesFromCalculations(selectedServices);
        const priceWithoutDiscounts = this.calculateSummaryPrice(finalServicesSelectionForCalculation, pricesForServicesInSelectedYear);
        const discount = this.getDiscounts(finalServicesSelectionForCalculation, selectedYear);
        return { basePrice: priceWithoutDiscounts, finalPrice: priceWithoutDiscounts - discount };
    }
}

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
) => { 
    const discountCalculator = new PossibleOperationsForServices();  
    let newSelection = action.type === "Select" ? [...previouslySelectedServices.filter(x => x !== action.service), action.service] : [...previouslySelectedServices.filter(x => x !== action.service)];
    return discountCalculator.removeNonsensServicesFromCalculations(newSelection);
}

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => { 
    const discountCalculator = new PossibleOperationsForServices(); 
    return discountCalculator.getServicesSummaryPriceWithAndWithoutDiscouts(selectedServices, selectedYear);
};
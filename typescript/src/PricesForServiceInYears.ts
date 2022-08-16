import { PriceForServiceTypeInYear } from "./PriceForServiceTypeInYear";
import { ServiceType } from "./ServiceType";
import { ServiceYear } from "./ServiceYear";
import { IPricesForServiceService } from "./IPricesForServiceService";
import { injectable, inject } from 'tsyringe';
import { IPricesForServiceInYears } from "./IPricesForServiceInYears";


@injectable()
export default class PricesForServiceInYears implements IPricesForServiceInYears {
    private pricesForServices: Array<PriceForServiceTypeInYear>;

    constructor(@inject('IPricesForServiceService') private _pricesServices: IPricesForServiceService) {
        this.pricesForServices = _pricesServices.GetPricesForServices();
    }

    private getDistinctItemsFromArray<Type>(list: Array<Type>) {
        return list.filter((x, i, a) => a.indexOf(x) == i);
    }

    private GetNotAvailableYEarError() {
        return new Error("This year is not available in services prices list.");
    }

    public GetServicePriceForYear(serviceType: ServiceType, year: ServiceYear) {
        const avaliableYears = this.getDistinctItemsFromArray(this.pricesForServices.map(x => x.year));
        const avaliableSerivces = this.getDistinctItemsFromArray((this.pricesForServices.map(x => x.service)));
        if (avaliableYears.indexOf(year) < 0) {
            throw this.GetNotAvailableYEarError();
        };
        if (avaliableSerivces.indexOf(serviceType) < 0) {
            throw new Error("No service for selected year.");
        };
        return this.pricesForServices.find(x => x.year === year && x.service == serviceType);


    }

    public GetServicesPricesForYear(year: ServiceYear) {
        const avaliableYears = this.getDistinctItemsFromArray(this.pricesForServices.map(x => x.year));
        if (avaliableYears.indexOf(year) < 0) {
            throw this.GetNotAvailableYEarError();
        };
        return this.pricesForServices.filter(x => x.year === year);
    }
}

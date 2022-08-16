import { IPricesForServiceService } from "./IPricesForServiceService";
import { PriceForServiceTypeInYear } from "./PriceForServiceTypeInYear";


export default class PricesForServiceService implements IPricesForServiceService {
    constructor() {
    }

    public GetPricesForServices(): Array<PriceForServiceTypeInYear> {
        return [
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
        ];
    }
}

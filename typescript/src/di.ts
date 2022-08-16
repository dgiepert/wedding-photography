import { container } from 'tsyringe';
import { PossibleOperationsForServices } from "./PossibleOperationsForServices";
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

export default container;

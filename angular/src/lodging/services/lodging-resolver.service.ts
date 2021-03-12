import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { LodgingService } from "./lodging.service";


@Injectable()
export class LodgingResolver implements Resolve<any> {
  constructor(
    private lodgingService: LodgingService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const lodgingId = route.paramMap.get('lodgingId')!;
    return this.lodgingService.loadLodging(lodgingId);
  }
}
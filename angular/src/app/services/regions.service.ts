import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';


@Injectable()
export class RegionsService {

  constructor(
    private http: HttpClient
  ) {
  }

  loadRegions(query: string) {
    return this.http.get(`/api/regions/all?q=${query}`);
  }
}

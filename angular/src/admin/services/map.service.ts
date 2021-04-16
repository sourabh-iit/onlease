import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable()
export class MapService {
    constructor(
        private http: HttpClient
    ) {}

    loadLodgings() {
        const url = '/api/admin/map/lodgings';
        return this.http.get(url);
    }
}
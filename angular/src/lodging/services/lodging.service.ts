import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable()
export class LodgingService {

  constructor(
    private http: HttpClient
  ) {
  }

  validateTourLink(link: string) {
    return this.http.post('/api/lodging/tour-link/validate', {link});
  }

  create(data: Lodging) {
    return this.http.post('/api/lodging/create', data);
  }

  update(data: Lodging) {
    return this.http.put(`/api/lodging/${data.id}`, data);
  }

  uploadLodgingImage(data: any) {
    return this.http.post('/api/lodging/images', data);
  }

  loadLodging(lodgingId: string|number) {
    return this.http.get(`/api/lodging/${lodgingId}`);
  }

  deleteLodgingImage(imageId: string|number) {
    return this.http.delete(`/api/lodging/images/${imageId}`);
  }

  updateImageTag(imageId: any, data: any) {
    return this.http.put(`/api/lodging/images/${imageId}`, data);
  }

  uploadLodgingVRImage(data: any) {
    return this.http.post('/api/lodging/vrimages', data, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteLodgingVRImage(imageId: string|number) {
    return this.http.delete(`/api/lodging/vrimages/${imageId}`);
  }

  loadLodgings(regions: string[]) {
    let params = new HttpParams();
    for(let region of regions) {
      params.set("regions", region);
    }
    return this.http.get('/api/lodging/list', {params});
  }

  confirmVaccant(lodgingId: any) {
    let url = `/api/lodging/${lodgingId}/twilio/confirm-vaccancy`;
    return this.http.post(url, {});
  }

  bookLodging(lodgingId: any) {
    let url = `/api/transactions/lodging/${lodgingId}/create`;
    return this.http.post(url, {});
  }

  getAllCharges(lodgingId: any) {
    const url = `/api/lodging/charges/${lodgingId}`;
    return this.http.get(url);
  }
}

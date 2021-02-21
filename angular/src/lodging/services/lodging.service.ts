import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';


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
}

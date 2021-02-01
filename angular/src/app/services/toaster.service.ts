import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";


@Injectable()
export class ToasterService {
  constructor(private toastr: ToastrService) {}

  error(title: string, message: string) {
    this.toastr.error(message, title);
  }

  success(title: string, message: string) {
    this.toastr.success(message, title);
  }
}

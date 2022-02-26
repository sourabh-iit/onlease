import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable()
export class TransactionService {
  constructor(
    private http: HttpClient
  ) { }
  
  public getTransaction(trans_id: string) {
    return this.http.get(`/api/transactions/${trans_id}`);
  }
}
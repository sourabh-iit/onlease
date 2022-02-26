import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TransactionService } from "src/transactions/services/transaction.service";


@Component({
  templateUrl: "./transaction.component.html",
  styleUrls: ["./transaction.component.scss"]
})
export class TransactionComponent {
  private trans_id: string | null;
  public transaction: LodgingTransaction;
  public numberToStatusMap = ["Successful", "Pending", "Cancelled", "Failed", "Refunded"];
  public transactionStatus = "";

  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService
  ) {
    this.trans_id = route.snapshot.paramMap.get('trans_id');
    if (this.trans_id) {
      this.transactionService.getTransaction(this.trans_id).subscribe((transaction: any) => {
        this.transaction = transaction;
        this.transactionStatus = this.numberToStatusMap[parseInt(this.transaction.status)];
      });
    }
  }

  get lodging() {
    return this.transaction?.lodging;
  }

  get address() {
    return this.lodging.address;
  }

  get lodgingAddress() {
    return `${this.lodging.address.text}, ${this.lodging.address.google_place_main_text}, ${this.lodging.address.google_place_secondary_text}`
  }

  get ownerPhoneNumbers() {
    const numbers = [this.lodging.posted_by.mobile_number, ...this.lodging.posted_by.mobile_numbers];
    return numbers.join(",");
  }
}
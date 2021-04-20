import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { finalize } from "rxjs/operators";
import { ToasterService } from "src/app/services/toaster.service";
import { UserService } from "src/app/services/user.service";


@Component({
    templateUrl: './agreements.component.html',
    styleUrls: ['./agreements.component.scss']
})
export class MyAgreementsComponent implements OnDestroy {

    public agreements: Agreement[] = [];
    public loading = false;
    private subs = new Subscription();

    constructor(
        private userService: UserService,
        private toaster: ToasterService
    ) {
        this.loadAgreements();
    }

    loadAgreements() {
        this.loading = true;
        this.subs.add(this.userService.loadAgreements().pipe(
            finalize(() => { this.loading = false; })
        ).subscribe((agreements: any) => {
            this.agreements = agreements;
        }));
    }

    delete(agreementId: number) {
        // TODO: confirm dialog
        this.subs.add(this.userService.deleteAgreement(agreementId).subscribe(() => {
            this.toaster.success('Success', 'Agreement deleted');
            this.agreements = this.agreements.filter((a: Agreement) => a.id != agreementId);
        }));
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { finalize } from "rxjs/operators";

import { ToasterService } from "src/app/services/toaster.service";
import { UserService } from "src/app/services/user.service";


@Component({
    templateUrl: './addresses.component.html',
    styleUrls: ['./addresses.component.scss']
})
export class MyAddressesComponent implements OnDestroy {

    public addresses: Address[] = [];
    public loading = false;
    private subs = new Subscription();

    constructor(
        private userService: UserService,
        private toaster: ToasterService
    ) {
        this.loadAddresses();
    }

    loadAddresses() {
        this.loading = true;
        this.subs.add(this.userService.loadAddresses().pipe(
            finalize(() => { this.loading = false; })
        ).subscribe((addresses: any) => {
            this.addresses = addresses;
        }));
    }

    delete(addressId: number) {
        // TODO: confirm dialog
        this.subs.add(this.userService.deleteAddress(addressId).subscribe(() => {
            this.toaster.success('Success', 'Address deleted');
            this.addresses = this.addresses.filter((a: Address) => a.id != addressId);
        }));
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
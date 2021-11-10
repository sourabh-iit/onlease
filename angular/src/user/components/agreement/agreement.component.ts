import { Component, OnDestroy } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { finalize } from "rxjs/operators";
import { ToasterService } from "src/app/services/toaster.service";

import { UserService } from "src/app/services/user.service";


export const pointsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const points = control.get('points') as FormArray;
    const totalPoints = points.controls.length;
  
    if(totalPoints < 1) {
        return { min_points: true };
    }
    return null;
};

@Component({
    templateUrl: './agreement.component.html',
    styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent implements OnDestroy {
    private subs = new Subscription();
    public agreementForm = this.fb.group({
        'title': ['', [Validators.required]],
        'points': this.fb.array([])
    }, {validators: pointsValidator});
    public loadingAgreement = false;
    public agreementId!: number;
    public savingAgreement = false;

    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private fb: FormBuilder,
        private toaster: ToasterService,
        private router: Router
    ){
        this.agreementId = parseInt(this.route.snapshot.paramMap.get('agreementId')!);
        if(this.agreementId != -1) {
            this.loadAgreement();
        }
    }

    get points() {
        return this.agreementForm.get('points') as FormArray;
    }

    private patchForm(agreement: Agreement) {
        this.agreementForm.patchValue(agreement);
        this.points.clear();
        for(let point of agreement.points) {
            this.points.push(this.fb.group({
              text: [point.text, [Validators.required]]
            }));
        }
    }

    loadAgreement() {
        this.loadingAgreement = true;
        this.subs.add(this.userService.loadAgreement(this.agreementId).pipe(
            finalize(() => { this.loadingAgreement = false; })
        ).subscribe((agreement: any) => {
            this.patchForm(agreement);
        }));
    }

    addNewPoint() {
        this.points.push(this.fb.group({
          text: ['', [Validators.required]]
        }));
    }

    saveAgreement() {
        this.savingAgreement = true;
        let obs: any;
        if(this.agreementId == -1) {
            obs = this.userService.cŗeateAgreement(this.agreementForm.value);
        } else {
            obs = this.userService.saveAgreement(this.agreementId, this.agreementForm.value);
        }
        this.subs.add(obs.pipe(
            finalize(() => { this.savingAgreement = false; })
        ).subscribe((agreement: any) => {
            if(this.agreementId == -1) {
              this.toaster.success('Success', 'Agreement created');
            } else {
                this.toaster.success('Success', 'Agreement saved');
            }
            this.router.navigateByUrl('/user/me/agreements');
        }));
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
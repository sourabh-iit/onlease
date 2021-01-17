(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["user-user-module"],{

/***/ "./src/app/user/components/profile/profile.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/user/components/profile/profile.component.ts ***!
  \**************************************************************/
/*! exports provided: ProfileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileComponent", function() { return ProfileComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/user.service */ "./src/app/user/services/user.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _shared_services_event_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../shared/services/event.service */ "./src/app/shared/services/event.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/card.js");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/form-field.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/input.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tooltip.js");














function ProfileComponent_mat_card_0_div_5_mat_error_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const error_r5 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](error_r5);
} }
function ProfileComponent_mat_card_0_div_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, ProfileComponent_mat_card_0_div_5_mat_error_1_Template, 2, 1, "mat-error", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r1.errors);
} }
function ProfileComponent_mat_card_0_mat_form_field_24_Template(rf, ctx) { if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-form-field", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Alternate number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "input", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ProfileComponent_mat_card_0_mat_form_field_24_Template_button_click_4_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r9); const i_r7 = ctx.index; const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2); return ctx_r8.removeNumber(i_r7); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "i", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const i_r7 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", i_r7);
} }
function ProfileComponent_mat_card_0_button_25_Template(rf, ctx) { if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ProfileComponent_mat_card_0_button_25_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r11); const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2); return ctx_r10.addNumber(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Add alternate number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function ProfileComponent_mat_card_0_Template(rf, ctx) { if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-card", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-card-header");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "mat-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "My Profile");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "mat-card-content", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, ProfileComponent_mat_card_0_div_5_Template, 2, 1, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "mat-form-field", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Email");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "input", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "mat-form-field", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Mobile number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "input", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "form", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "mat-form-field", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Name");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](18, "input", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "mat-form-field", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "Terms & conditions");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](22, "input", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](24, ProfileComponent_mat_card_0_mat_form_field_24_Template, 6, 1, "mat-form-field", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](25, ProfileComponent_mat_card_0_button_25_Template, 2, 0, "button", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "mat-card-footer", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "button", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ProfileComponent_mat_card_0_Template_button_click_27_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r13); const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r12.updateProfile(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, "Save");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.errors.length > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", ctx_r0.me.email);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", ctx_r0.me.mobile_number);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx_r0.profileForm);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r0.numbers.controls);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.numbers.length < 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", !ctx_r0.profileForm.valid);
} }
class ProfileComponent {
    constructor(userService, router, eventService, fb) {
        this.userService = userService;
        this.router = router;
        this.eventService = eventService;
        this.fb = fb;
        this.errors = [];
        this.profileForm = this.fb.group({
            name: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            tnc: [''],
            mobile_numbers: this.fb.array([])
        });
        this.subs = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subscription"]();
        this.subs.add(this.eventService.user$.subscribe((user) => {
            if (!user) {
                this.router.navigateByUrl('/user/signin');
            }
            user.name = `${user.first_name} ${user.last_name}`;
            if (!this.me) {
                this.me = user;
                this.profileForm.patchValue(this.me);
                for (let mobile_number of this.me.mobile_numbers) {
                    this.numbers.push(fb.control(mobile_number, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern('^[9876]{1}[0-9]{9}$'), _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]));
                }
            }
        }));
    }
    get numbers() {
        return this.profileForm.get('mobile_numbers');
    }
    ngOnDestroy() {
        this.subs.unsubscribe();
    }
    addNumber() {
        this.numbers.push(this.fb.control('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern('^[9876]{1}[0-9]{9}$'), _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]));
    }
    removeNumber(index) {
        this.numbers.removeAt(index);
    }
    updateProfile() {
        this.userService.updateProfile(this.profileForm.value).subscribe((res) => {
            this.me = res.user;
        }, (res) => {
            this.errors = res.error;
        });
    }
}
ProfileComponent.ɵfac = function ProfileComponent_Factory(t) { return new (t || ProfileComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_user_service__WEBPACK_IMPORTED_MODULE_3__["UserService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_shared_services_event_service__WEBPACK_IMPORTED_MODULE_5__["EventService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"])); };
ProfileComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ProfileComponent, selectors: [["ng-component"]], decls: 1, vars: 1, consts: [["class", "signup", 4, "ngIf"], [1, "signup"], [1, "content"], ["class", "errors", 4, "ngIf"], [1, "email"], ["readonly", "", "type", "email", "matInput", "", "name", "email", 3, "value"], [1, "number"], ["readonly", "", "matInput", "", "name", "number", 3, "value"], [1, "signup-form", 3, "formGroup"], [1, "name"], ["matInput", "", "name", "name", "formControlName", "name"], [1, "tnc"], ["matInput", "", "name", "tnc", "formControlName", "tnc"], ["formArrayName", "mobile_numbers"], ["class", "number", 4, "ngFor", "ngForOf"], ["mat-raised-button", "", "color", "accent", 3, "click", 4, "ngIf"], [1, "footer"], ["mat-raised-button", "", "color", "primary", 1, "signup-button", 3, "disabled", "click"], [1, "errors"], [4, "ngFor", "ngForOf"], ["matInput", "", "name", "number", 3, "formControlName"], ["mat-icon-button", "", "matSuffix", "", "matTooltip", "Remove", 3, "click"], [1, "fa", "fa-times-circle", "text-danger"], ["mat-raised-button", "", "color", "accent", 3, "click"]], template: function ProfileComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, ProfileComponent_mat_card_0_Template, 29, 7, "mat-card", 0);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.me);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCard"], _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardHeader"], _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardTitle"], _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardContent"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__["MatFormField"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__["MatLabel"], _angular_material_input__WEBPACK_IMPORTED_MODULE_9__["MatInput"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlName"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormArrayName"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgForOf"], _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardFooter"], _angular_material_button__WEBPACK_IMPORTED_MODULE_10__["MatButton"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__["MatError"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__["MatSuffix"], _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_11__["MatTooltip"]], styles: [".signup[_ngcontent-%COMP%] {\n  max-width: 500px;\n  margin: auto;\n  margin-top: 30px;\n  font-size: 15px;\n}\n.signup[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%] {\n  margin: 0 16px;\n}\n.signup[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.signup[_ngcontent-%COMP%]   .signup-button[_ngcontent-%COMP%] {\n  width: 100%;\n  cursor: pointer;\n  margin-top: 10px;\n}\n.signup[_ngcontent-%COMP%]   .footer[_ngcontent-%COMP%] {\n  margin: 0 16px;\n}\n.signup[_ngcontent-%COMP%]   .footer[_ngcontent-%COMP%]   .signedup[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-top: 10px;\n}\n.errors[_ngcontent-%COMP%] {\n  margin-bottom: 5px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdXNlci9jb21wb25lbnRzL3Byb2ZpbGUvcHJvZmlsZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGdCQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0VBQ0EsZUFBQTtBQUNGO0FBQ0U7RUFDRSxjQUFBO0FBQ0o7QUFDSTtFQUNFLFdBQUE7QUFDTjtBQUdFO0VBQ0UsV0FBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtBQURKO0FBSUU7RUFDRSxjQUFBO0FBRko7QUFJSTtFQUNFLGtCQUFBO0VBQ0EsZ0JBQUE7QUFGTjtBQU1BO0VBQ0Usa0JBQUE7QUFIRiIsImZpbGUiOiJzcmMvYXBwL3VzZXIvY29tcG9uZW50cy9wcm9maWxlL3Byb2ZpbGUuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuc2lnbnVwIHtcbiAgbWF4LXdpZHRoOiA1MDBweDtcbiAgbWFyZ2luOiBhdXRvO1xuICBtYXJnaW4tdG9wOiAzMHB4O1xuICBmb250LXNpemU6IDE1cHg7XG5cbiAgLmNvbnRlbnQge1xuICAgIG1hcmdpbjogMCAxNnB4O1xuXG4gICAgbWF0LWZvcm0tZmllbGQge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuICB9XG5cbiAgLnNpZ251cC1idXR0b24ge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBtYXJnaW4tdG9wOiAxMHB4O1xuICB9XG5cbiAgLmZvb3RlciB7XG4gICAgbWFyZ2luOiAwIDE2cHg7XG5cbiAgICAuc2lnbmVkdXAge1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgbWFyZ2luLXRvcDogMTBweDtcbiAgICB9XG4gIH1cbn1cbi5lcnJvcnMge1xuICBtYXJnaW4tYm90dG9tOiA1cHg7XG59XG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ProfileComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                templateUrl: './profile.component.html',
                styleUrls: ['./profile.component.scss']
            }]
    }], function () { return [{ type: _services_user_service__WEBPACK_IMPORTED_MODULE_3__["UserService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"] }, { type: _shared_services_event_service__WEBPACK_IMPORTED_MODULE_5__["EventService"] }, { type: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"] }]; }, null); })();


/***/ }),

/***/ "./src/app/user/components/signin/signin.component.ts":
/*!************************************************************!*\
  !*** ./src/app/user/components/signin/signin.component.ts ***!
  \************************************************************/
/*! exports provided: UserSigninComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserSigninComponent", function() { return UserSigninComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/user.service */ "./src/app/user/services/user.service.ts");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/snack-bar.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/card.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/form-field.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/input.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");











function UserSigninComponent_div_5_mat_error_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const error_r5 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](error_r5);
} }
function UserSigninComponent_div_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, UserSigninComponent_div_5_mat_error_1_Template, 2, 1, "mat-error", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r0.errors);
} }
class UserSigninComponent {
    constructor(userService, snackBar, router) {
        this.userService = userService;
        this.snackBar = snackBar;
        this.router = router;
        this.user = {
            username: '',
            password: ''
        };
        this.errors = [];
    }
    login() {
        this.errors = [];
        this.userService.login(this.user).subscribe((data) => {
            this.router.navigateByUrl('/');
        }, (res) => {
            this.errors = res.error ? res.error : [];
        });
    }
}
UserSigninComponent.ɵfac = function UserSigninComponent_Factory(t) { return new (t || UserSigninComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_user_service__WEBPACK_IMPORTED_MODULE_1__["UserService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"])); };
UserSigninComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: UserSigninComponent, selectors: [["ng-component"]], decls: 23, vars: 4, consts: [[1, "signup"], [1, "content"], ["class", "errors", 4, "ngIf"], [1, "signup-form"], ["signinForm", "ngForm"], [1, "name"], ["required", "", "matInput", "", "name", "name", 3, "ngModel", "ngModelChange"], ["name", "ngModel"], [1, "email"], ["required", "", "type", "password", "matInput", "", "name", "password", 3, "ngModel", "ngModelChange"], ["password", "ngModel"], [1, "footer"], ["mat-raised-button", "", "color", "primary", 1, "signup-button", 3, "disabled", "click"], ["routerLink", "../forgot-password", 1, "forgot-password"], [1, "errors"], [4, "ngFor", "ngForOf"]], template: function UserSigninComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-card", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-card-header");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "mat-card-title");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Sign In");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "mat-card-content", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, UserSigninComponent_div_5_Template, 2, 1, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "form", 3, 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "mat-form-field", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "Mobile number or Email");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "input", 6, 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function UserSigninComponent_Template_input_ngModelChange_11_listener($event) { return ctx.user.username = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "mat-form-field", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "input", 9, 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function UserSigninComponent_Template_input_ngModelChange_16_listener($event) { return ctx.user.password = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "mat-card-footer", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "button", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function UserSigninComponent_Template_button_click_19_listener() { return ctx.login(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Sign In");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "a", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, " Forgot Password? ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.errors.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.user.username);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.user.password);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", !_r1.valid);
    } }, directives: [_angular_material_card__WEBPACK_IMPORTED_MODULE_4__["MatCard"], _angular_material_card__WEBPACK_IMPORTED_MODULE_4__["MatCardHeader"], _angular_material_card__WEBPACK_IMPORTED_MODULE_4__["MatCardTitle"], _angular_material_card__WEBPACK_IMPORTED_MODULE_4__["MatCardContent"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgForm"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__["MatFormField"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__["MatLabel"], _angular_material_input__WEBPACK_IMPORTED_MODULE_8__["MatInput"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["RequiredValidator"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgModel"], _angular_material_card__WEBPACK_IMPORTED_MODULE_4__["MatCardFooter"], _angular_material_button__WEBPACK_IMPORTED_MODULE_9__["MatButton"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterLinkWithHref"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgForOf"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__["MatError"]], styles: [".signup[_ngcontent-%COMP%] {\n  max-width: 500px;\n  margin: auto;\n  margin-top: 30px;\n  font-size: 15px;\n}\n.signup[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%] {\n  margin: 0 16px;\n}\n.signup[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.signup[_ngcontent-%COMP%]   .signup-button[_ngcontent-%COMP%] {\n  width: 100%;\n  cursor: pointer;\n  margin-bottom: 10px;\n}\n.signup[_ngcontent-%COMP%]   .footer[_ngcontent-%COMP%] {\n  margin: 0 16px;\n}\n.errors[_ngcontent-%COMP%] {\n  margin-bottom: 5px;\n}\n.forgot-password[_ngcontent-%COMP%] {\n  color: yellow;\n  text-align: center;\n  display: block;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdXNlci9jb21wb25lbnRzL3NpZ25pbi9zaWduaW4uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxnQkFBQTtFQUNBLFlBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7QUFDRjtBQUNFO0VBQ0UsY0FBQTtBQUNKO0FBQ0k7RUFDRSxXQUFBO0FBQ047QUFHRTtFQUNFLFdBQUE7RUFDQSxlQUFBO0VBQ0EsbUJBQUE7QUFESjtBQUlFO0VBQ0UsY0FBQTtBQUZKO0FBS0E7RUFDRSxrQkFBQTtBQUZGO0FBSUE7RUFDRSxhQUFBO0VBQ0Esa0JBQUE7RUFDQSxjQUFBO0FBREYiLCJmaWxlIjoic3JjL2FwcC91c2VyL2NvbXBvbmVudHMvc2lnbmluL3NpZ25pbi5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5zaWdudXAge1xuICBtYXgtd2lkdGg6IDUwMHB4O1xuICBtYXJnaW46IGF1dG87XG4gIG1hcmdpbi10b3A6IDMwcHg7XG4gIGZvbnQtc2l6ZTogMTVweDtcblxuICAuY29udGVudCB7XG4gICAgbWFyZ2luOiAwIDE2cHg7XG5cbiAgICBtYXQtZm9ybS1maWVsZCB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG4gIH1cblxuICAuc2lnbnVwLWJ1dHRvbiB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gIH1cblxuICAuZm9vdGVyIHtcbiAgICBtYXJnaW46IDAgMTZweDtcbiAgfVxufVxuLmVycm9ycyB7XG4gIG1hcmdpbi1ib3R0b206IDVweDtcbn1cbi5mb3Jnb3QtcGFzc3dvcmQge1xuICBjb2xvcjogeWVsbG93O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](UserSigninComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                templateUrl: './signin.component.html',
                styleUrls: ['./signin.component.scss']
            }]
    }], function () { return [{ type: _services_user_service__WEBPACK_IMPORTED_MODULE_1__["UserService"] }, { type: _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"] }]; }, null); })();


/***/ }),

/***/ "./src/app/user/components/signup/signup.component.ts":
/*!************************************************************!*\
  !*** ./src/app/user/components/signup/signup.component.ts ***!
  \************************************************************/
/*! exports provided: UserSignupComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserSignupComponent", function() { return UserSignupComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/user.service */ "./src/app/user/services/user.service.ts");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/snack-bar.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/card.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/form-field.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/input.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");











function UserSignupComponent_div_5_mat_error_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const error_r7 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](error_r7);
} }
function UserSignupComponent_div_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, UserSignupComponent_div_5_mat_error_1_Template, 2, 1, "mat-error", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r0.errors);
} }
class UserSignupComponent {
    constructor(userService, snackBar, router) {
        this.userService = userService;
        this.snackBar = snackBar;
        this.router = router;
        this.user = {
            name: '',
            number: '',
            email: '',
            password: ''
        };
        this.errors = [];
    }
    register() {
        this.errors = [];
        this.userService.register(this.user).subscribe(() => {
            this.router.navigateByUrl('/user/verify-number');
        }, (res) => {
            this.errors = res.error;
        });
    }
}
UserSignupComponent.ɵfac = function UserSignupComponent_Factory(t) { return new (t || UserSignupComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_user_service__WEBPACK_IMPORTED_MODULE_1__["UserService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"])); };
UserSignupComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: UserSignupComponent, selectors: [["ng-component"]], decls: 35, vars: 6, consts: [[1, "signup"], [1, "content"], ["class", "errors", 4, "ngIf"], [1, "signup-form"], ["signupForm", "ngForm"], [1, "name"], ["required", "", "matInput", "", "name", "name", 3, "ngModel", "ngModelChange"], ["name", "ngModel"], [1, "email"], ["required", "", "type", "email", "pattern", "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$", "matInput", "", "name", "email", 3, "ngModel", "ngModelChange"], ["email", "ngModel"], ["required", "", "type", "password", "matInput", "", "name", "password", 3, "ngModel", "ngModelChange"], ["password", "ngModel"], ["required", "", "matInput", "", "name", "number", "pattern", "[9876]{1}[0-9]{9}", 3, "ngModel", "ngModelChange"], ["number", "ngModel"], [1, "footer"], ["mat-raised-button", "", "color", "primary", 1, "signup-button", 3, "disabled", "click"], [1, "signedup"], ["mat-raised-button", "", "color", "primary", "routerLink", "../signin"], [1, "errors"], [4, "ngFor", "ngForOf"]], template: function UserSignupComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-card", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-card-header");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "mat-card-title");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Sign Up");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "mat-card-content", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, UserSignupComponent_div_5_Template, 2, 1, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "form", 3, 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "mat-form-field", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "input", 6, 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function UserSignupComponent_Template_input_ngModelChange_11_listener($event) { return ctx.user.name = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "mat-form-field", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Email");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "input", 9, 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function UserSignupComponent_Template_input_ngModelChange_16_listener($event) { return ctx.user.email = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "mat-form-field", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "input", 11, 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function UserSignupComponent_Template_input_ngModelChange_21_listener($event) { return ctx.user.password = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "mat-form-field", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "Mobile number");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "input", 13, 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function UserSignupComponent_Template_input_ngModelChange_26_listener($event) { return ctx.user.number = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "mat-card-footer", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "button", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function UserSignupComponent_Template_button_click_29_listener() { return ctx.register(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, "Sign Up");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, " Already registered? ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "button", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, "Sign In");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.errors.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.user.name);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.user.email);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.user.password);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.user.number);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", !_r1.valid);
    } }, directives: [_angular_material_card__WEBPACK_IMPORTED_MODULE_4__["MatCard"], _angular_material_card__WEBPACK_IMPORTED_MODULE_4__["MatCardHeader"], _angular_material_card__WEBPACK_IMPORTED_MODULE_4__["MatCardTitle"], _angular_material_card__WEBPACK_IMPORTED_MODULE_4__["MatCardContent"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgForm"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__["MatFormField"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__["MatLabel"], _angular_material_input__WEBPACK_IMPORTED_MODULE_8__["MatInput"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["RequiredValidator"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgModel"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["PatternValidator"], _angular_material_card__WEBPACK_IMPORTED_MODULE_4__["MatCardFooter"], _angular_material_button__WEBPACK_IMPORTED_MODULE_9__["MatButton"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterLink"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgForOf"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__["MatError"]], styles: [".signup[_ngcontent-%COMP%] {\n  max-width: 500px;\n  margin: auto;\n  margin-top: 30px;\n  font-size: 15px;\n}\n.signup[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%] {\n  margin: 0 16px;\n}\n.signup[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.signup[_ngcontent-%COMP%]   .signup-button[_ngcontent-%COMP%] {\n  width: 100%;\n  cursor: pointer;\n}\n.signup[_ngcontent-%COMP%]   .footer[_ngcontent-%COMP%] {\n  margin: 0 16px;\n}\n.signup[_ngcontent-%COMP%]   .footer[_ngcontent-%COMP%]   .signedup[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-top: 10px;\n}\n.errors[_ngcontent-%COMP%] {\n  margin-bottom: 5px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdXNlci9jb21wb25lbnRzL3NpZ251cC9zaWdudXAuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxnQkFBQTtFQUNBLFlBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7QUFDRjtBQUNFO0VBQ0UsY0FBQTtBQUNKO0FBQ0k7RUFDRSxXQUFBO0FBQ047QUFHRTtFQUNFLFdBQUE7RUFDQSxlQUFBO0FBREo7QUFJRTtFQUNFLGNBQUE7QUFGSjtBQUlJO0VBQ0Usa0JBQUE7RUFDQSxnQkFBQTtBQUZOO0FBTUE7RUFDRSxrQkFBQTtBQUhGIiwiZmlsZSI6InNyYy9hcHAvdXNlci9jb21wb25lbnRzL3NpZ251cC9zaWdudXAuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuc2lnbnVwIHtcbiAgbWF4LXdpZHRoOiA1MDBweDtcbiAgbWFyZ2luOiBhdXRvO1xuICBtYXJnaW4tdG9wOiAzMHB4O1xuICBmb250LXNpemU6IDE1cHg7XG5cbiAgLmNvbnRlbnQge1xuICAgIG1hcmdpbjogMCAxNnB4O1xuXG4gICAgbWF0LWZvcm0tZmllbGQge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuICB9XG5cbiAgLnNpZ251cC1idXR0b24ge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgfVxuXG4gIC5mb290ZXIge1xuICAgIG1hcmdpbjogMCAxNnB4O1xuXG4gICAgLnNpZ25lZHVwIHtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIG1hcmdpbi10b3A6IDEwcHg7XG4gICAgfVxuICB9XG59XG4uZXJyb3JzIHtcbiAgbWFyZ2luLWJvdHRvbTogNXB4O1xufVxuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](UserSignupComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                templateUrl: './signup.component.html',
                styleUrls: ['./signup.component.scss']
            }]
    }], function () { return [{ type: _services_user_service__WEBPACK_IMPORTED_MODULE_1__["UserService"] }, { type: _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"] }]; }, null); })();


/***/ }),

/***/ "./src/app/user/components/verifynumber/verify.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/user/components/verifynumber/verify.component.ts ***!
  \******************************************************************/
/*! exports provided: VerifyNumberComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VerifyNumberComponent", function() { return VerifyNumberComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/user.service */ "./src/app/user/services/user.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var src_app_shared_services_event_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/shared/services/event.service */ "./src/app/shared/services/event.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/card.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/form-field.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/input.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");











function VerifyNumberComponent_mat_card_0_div_5_mat_error_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const error_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](error_r6);
} }
function VerifyNumberComponent_mat_card_0_div_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, VerifyNumberComponent_mat_card_0_div_5_mat_error_1_Template, 2, 1, "mat-error", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r2.errors);
} }
function VerifyNumberComponent_mat_card_0_Template(rf, ctx) { if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-card", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-card-header");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "mat-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Verify");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "mat-card-content", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, VerifyNumberComponent_mat_card_0_div_5_Template, 2, 1, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "form", 5, 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "mat-form-field", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "OTP");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "input", 8, 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function VerifyNumberComponent_mat_card_0_Template_input_ngModelChange_11_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r8); const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r7.userOtp = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "mat-hint");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "OTP will expire in 5 minutes");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "mat-card-footer", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function VerifyNumberComponent_mat_card_0_Template_button_click_16_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r8); const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r9.verify(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Verify");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](7);
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.errors.length > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx_r0.userOtp);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", !_r3.valid);
} }
function VerifyNumberComponent_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "i", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "You have verified your number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "a", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, " Go to home ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
class VerifyNumberComponent {
    constructor(userService, router, eventService) {
        this.userService = userService;
        this.router = router;
        this.eventService = eventService;
        this.userOtp = '';
        this.otpSent = false;
        this.numberVerified = false;
        this.errors = [];
        this.eventService.user$.subscribe((user) => {
            if (!user) {
                this.router.navigateByUrl('/user/signin');
            }
            if (user.is_verified) {
                this.numberVerified = true;
            }
            else {
                this.userService.sendOtpToNumber().subscribe(() => {
                    this.otpSent = true;
                }, (res) => {
                    this.errors = res.error;
                });
            }
        });
    }
    verify() {
        this.errors = [];
        this.userService.verifyNumber(this.userOtp).subscribe((data) => {
            this.numberVerified = true;
        }, (res) => {
            this.errors = res.error;
        });
    }
}
VerifyNumberComponent.ɵfac = function VerifyNumberComponent_Factory(t) { return new (t || VerifyNumberComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_user_service__WEBPACK_IMPORTED_MODULE_1__["UserService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](src_app_shared_services_event_service__WEBPACK_IMPORTED_MODULE_3__["EventService"])); };
VerifyNumberComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: VerifyNumberComponent, selectors: [["ng-component"]], decls: 2, vars: 2, consts: [["class", "signup", 4, "ngIf"], ["class", "number-verified", 4, "ngIf"], [1, "signup"], [1, "content"], ["class", "errors", 4, "ngIf"], [1, "signup-form"], ["verifyForm", "ngForm"], [1, "name"], ["required", "", "matInput", "", "name", "name", "pattern", "[0-9]{4,6}", 3, "ngModel", "ngModelChange"], ["name", "ngModel"], [1, "footer"], ["mat-raised-button", "", "color", "primary", 1, "signup-button", 3, "disabled", "click"], [1, "errors"], [4, "ngFor", "ngForOf"], [1, "number-verified"], [1, "fa", "fa-check-circle"], ["routerLink", "/", 1, "gotohome"]], template: function VerifyNumberComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, VerifyNumberComponent_mat_card_0_Template, 18, 3, "mat-card", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, VerifyNumberComponent_div_1_Template, 6, 0, "div", 1);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.numberVerified);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.numberVerified);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"], _angular_material_card__WEBPACK_IMPORTED_MODULE_5__["MatCard"], _angular_material_card__WEBPACK_IMPORTED_MODULE_5__["MatCardHeader"], _angular_material_card__WEBPACK_IMPORTED_MODULE_5__["MatCardTitle"], _angular_material_card__WEBPACK_IMPORTED_MODULE_5__["MatCardContent"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgForm"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__["MatFormField"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__["MatLabel"], _angular_material_input__WEBPACK_IMPORTED_MODULE_8__["MatInput"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["RequiredValidator"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["PatternValidator"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgModel"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__["MatHint"], _angular_material_card__WEBPACK_IMPORTED_MODULE_5__["MatCardFooter"], _angular_material_button__WEBPACK_IMPORTED_MODULE_9__["MatButton"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgForOf"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__["MatError"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterLinkWithHref"]], styles: [".signup[_ngcontent-%COMP%] {\n  max-width: 500px;\n  margin: auto;\n  margin-top: 30px;\n  font-size: 15px;\n}\n.signup[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%] {\n  margin: 0 16px;\n}\n.signup[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.signup[_ngcontent-%COMP%]   .signup-button[_ngcontent-%COMP%] {\n  width: 100%;\n  cursor: pointer;\n  margin-top: 10px;\n}\n.signup[_ngcontent-%COMP%]   .footer[_ngcontent-%COMP%] {\n  margin: 0 16px;\n}\n.signup[_ngcontent-%COMP%]   .footer[_ngcontent-%COMP%]   .signedup[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-top: 10px;\n}\n.errors[_ngcontent-%COMP%] {\n  margin-bottom: 5px;\n}\n.number-verified[_ngcontent-%COMP%] {\n  color: green;\n  margin-top: 50px;\n  font-size: 30px;\n  text-align: center;\n}\n.number-verified[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  margin-left: 5px;\n}\n.number-verified[_ngcontent-%COMP%]   .gotohome[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 10px;\n  font-size: 20px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdXNlci9jb21wb25lbnRzL3ZlcmlmeW51bWJlci92ZXJpZnkuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxnQkFBQTtFQUNBLFlBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7QUFDRjtBQUNFO0VBQ0UsY0FBQTtBQUNKO0FBQ0k7RUFDRSxXQUFBO0FBQ047QUFHRTtFQUNFLFdBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7QUFESjtBQUlFO0VBQ0UsY0FBQTtBQUZKO0FBSUk7RUFDRSxrQkFBQTtFQUNBLGdCQUFBO0FBRk47QUFNQTtFQUNFLGtCQUFBO0FBSEY7QUFLQTtFQUNFLFlBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSxrQkFBQTtBQUZGO0FBSUU7RUFDRSxnQkFBQTtBQUZKO0FBS0U7RUFDRSxjQUFBO0VBQ0EsZ0JBQUE7RUFDQSxlQUFBO0FBSEoiLCJmaWxlIjoic3JjL2FwcC91c2VyL2NvbXBvbmVudHMvdmVyaWZ5bnVtYmVyL3ZlcmlmeS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5zaWdudXAge1xuICBtYXgtd2lkdGg6IDUwMHB4O1xuICBtYXJnaW46IGF1dG87XG4gIG1hcmdpbi10b3A6IDMwcHg7XG4gIGZvbnQtc2l6ZTogMTVweDtcblxuICAuY29udGVudCB7XG4gICAgbWFyZ2luOiAwIDE2cHg7XG5cbiAgICBtYXQtZm9ybS1maWVsZCB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG4gIH1cblxuICAuc2lnbnVwLWJ1dHRvbiB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIG1hcmdpbi10b3A6IDEwcHg7XG4gIH1cblxuICAuZm9vdGVyIHtcbiAgICBtYXJnaW46IDAgMTZweDtcblxuICAgIC5zaWduZWR1cCB7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICBtYXJnaW4tdG9wOiAxMHB4O1xuICAgIH1cbiAgfVxufVxuLmVycm9ycyB7XG4gIG1hcmdpbi1ib3R0b206IDVweDtcbn1cbi5udW1iZXItdmVyaWZpZWQge1xuICBjb2xvcjogZ3JlZW47XG4gIG1hcmdpbi10b3A6IDUwcHg7XG4gIGZvbnQtc2l6ZTogMzBweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuXG4gIHNwYW4ge1xuICAgIG1hcmdpbi1sZWZ0OiA1cHg7XG4gIH1cblxuICAuZ290b2hvbWUge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIG1hcmdpbi10b3A6IDEwcHg7XG4gICAgZm9udC1zaXplOiAyMHB4O1xuICB9XG59XG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](VerifyNumberComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                templateUrl: './verify.component.html',
                styleUrls: ['./verify.component.scss']
            }]
    }], function () { return [{ type: _services_user_service__WEBPACK_IMPORTED_MODULE_1__["UserService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }, { type: src_app_shared_services_event_service__WEBPACK_IMPORTED_MODULE_3__["EventService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/user/user-routing.module.ts":
/*!*********************************************!*\
  !*** ./src/app/user/user-routing.module.ts ***!
  \*********************************************/
/*! exports provided: UserRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserRoutingModule", function() { return UserRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _components_signin_signin_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/signin/signin.component */ "./src/app/user/components/signin/signin.component.ts");
/* harmony import */ var _components_signup_signup_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/signup/signup.component */ "./src/app/user/components/signup/signup.component.ts");
/* harmony import */ var _components_verifynumber_verify_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/verifynumber/verify.component */ "./src/app/user/components/verifynumber/verify.component.ts");
/* harmony import */ var _components_profile_profile_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/profile/profile.component */ "./src/app/user/components/profile/profile.component.ts");








const routes = [
    { path: 'signin', component: _components_signin_signin_component__WEBPACK_IMPORTED_MODULE_2__["UserSigninComponent"] },
    { path: 'signup', component: _components_signup_signup_component__WEBPACK_IMPORTED_MODULE_3__["UserSignupComponent"] },
    { path: 'verify-number', component: _components_verifynumber_verify_component__WEBPACK_IMPORTED_MODULE_4__["VerifyNumberComponent"] },
    { path: 'profile', component: _components_profile_profile_component__WEBPACK_IMPORTED_MODULE_5__["ProfileComponent"] }
];
class UserRoutingModule {
}
UserRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: UserRoutingModule });
UserRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function UserRoutingModule_Factory(t) { return new (t || UserRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](UserRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](UserRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/user/user.module.ts":
/*!*************************************!*\
  !*** ./src/app/user/user.module.ts ***!
  \*************************************/
/*! exports provided: UserModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserModule", function() { return UserModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/input.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/card.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/divider */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/divider.js");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/snack-bar.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tooltip.js");
/* harmony import */ var _user_routing_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./user-routing.module */ "./src/app/user/user-routing.module.ts");
/* harmony import */ var _components_signin_signin_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/signin/signin.component */ "./src/app/user/components/signin/signin.component.ts");
/* harmony import */ var _components_signup_signup_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/signup/signup.component */ "./src/app/user/components/signup/signup.component.ts");
/* harmony import */ var _components_verifynumber_verify_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/verifynumber/verify.component */ "./src/app/user/components/verifynumber/verify.component.ts");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./services/user.service */ "./src/app/user/services/user.service.ts");
/* harmony import */ var _components_profile_profile_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/profile/profile.component */ "./src/app/user/components/profile/profile.component.ts");

















class UserModule {
}
UserModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: UserModule });
UserModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function UserModule_Factory(t) { return new (t || UserModule)(); }, providers: [
        _services_user_service__WEBPACK_IMPORTED_MODULE_13__["UserService"]
    ], imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_7__["CommonModule"],
            _angular_material_input__WEBPACK_IMPORTED_MODULE_1__["MatInputModule"],
            _angular_material_card__WEBPACK_IMPORTED_MODULE_2__["MatCardModule"],
            _angular_material_button__WEBPACK_IMPORTED_MODULE_3__["MatButtonModule"],
            _angular_material_divider__WEBPACK_IMPORTED_MODULE_4__["MatDividerModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormsModule"],
            _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__["MatSnackBarModule"],
            _user_routing_module__WEBPACK_IMPORTED_MODULE_9__["UserRoutingModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ReactiveFormsModule"],
            _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_8__["MatTooltipModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](UserModule, { declarations: [_components_signin_signin_component__WEBPACK_IMPORTED_MODULE_10__["UserSigninComponent"],
        _components_signup_signup_component__WEBPACK_IMPORTED_MODULE_11__["UserSignupComponent"],
        _components_verifynumber_verify_component__WEBPACK_IMPORTED_MODULE_12__["VerifyNumberComponent"],
        _components_profile_profile_component__WEBPACK_IMPORTED_MODULE_14__["ProfileComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_7__["CommonModule"],
        _angular_material_input__WEBPACK_IMPORTED_MODULE_1__["MatInputModule"],
        _angular_material_card__WEBPACK_IMPORTED_MODULE_2__["MatCardModule"],
        _angular_material_button__WEBPACK_IMPORTED_MODULE_3__["MatButtonModule"],
        _angular_material_divider__WEBPACK_IMPORTED_MODULE_4__["MatDividerModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormsModule"],
        _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__["MatSnackBarModule"],
        _user_routing_module__WEBPACK_IMPORTED_MODULE_9__["UserRoutingModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ReactiveFormsModule"],
        _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_8__["MatTooltipModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](UserModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [
                    _components_signin_signin_component__WEBPACK_IMPORTED_MODULE_10__["UserSigninComponent"],
                    _components_signup_signup_component__WEBPACK_IMPORTED_MODULE_11__["UserSignupComponent"],
                    _components_verifynumber_verify_component__WEBPACK_IMPORTED_MODULE_12__["VerifyNumberComponent"],
                    _components_profile_profile_component__WEBPACK_IMPORTED_MODULE_14__["ProfileComponent"]
                ],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_7__["CommonModule"],
                    _angular_material_input__WEBPACK_IMPORTED_MODULE_1__["MatInputModule"],
                    _angular_material_card__WEBPACK_IMPORTED_MODULE_2__["MatCardModule"],
                    _angular_material_button__WEBPACK_IMPORTED_MODULE_3__["MatButtonModule"],
                    _angular_material_divider__WEBPACK_IMPORTED_MODULE_4__["MatDividerModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormsModule"],
                    _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__["MatSnackBarModule"],
                    _user_routing_module__WEBPACK_IMPORTED_MODULE_9__["UserRoutingModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ReactiveFormsModule"],
                    _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_8__["MatTooltipModule"]
                ],
                providers: [
                    _services_user_service__WEBPACK_IMPORTED_MODULE_13__["UserService"]
                ]
            }]
    }], null, null); })();


/***/ })

}]);
//# sourceMappingURL=user-user-module.js.map
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["ads-ads-module"],{

/***/ "./src/app/ads/ads-routing.module.ts":
/*!*******************************************!*\
  !*** ./src/app/ads/ads-routing.module.ts ***!
  \*******************************************/
/*! exports provided: AdsRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdsRoutingModule", function() { return AdsRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _components_ad_ad_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/ad/ad.component */ "./src/app/ads/components/ad/ad.component.ts");
/* harmony import */ var _components_ads_ads_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/ads/ads.component */ "./src/app/ads/components/ads/ads.component.ts");
/* harmony import */ var _components_edit_edit_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/edit/edit.component */ "./src/app/ads/components/edit/edit.component.ts");







const routes = [
    { path: '', component: _components_ads_ads_component__WEBPACK_IMPORTED_MODULE_3__["AdsComponent"] },
    { path: ':adId/edit', component: _components_edit_edit_component__WEBPACK_IMPORTED_MODULE_4__["AdEditComponent"] },
    { path: ':adId', component: _components_ad_ad_component__WEBPACK_IMPORTED_MODULE_2__["AdComponent"] },
    { path: '**', redirectTo: '' }
];
class AdsRoutingModule {
}
AdsRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: AdsRoutingModule });
AdsRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function AdsRoutingModule_Factory(t) { return new (t || AdsRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AdsRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AdsRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/ads/ads.module.ts":
/*!***********************************!*\
  !*** ./src/app/ads/ads.module.ts ***!
  \***********************************/
/*! exports provided: AdsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdsModule", function() { return AdsModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/input.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/card.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/divider */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/divider.js");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/snack-bar.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tooltip.js");
/* harmony import */ var _ads_routing_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ads-routing.module */ "./src/app/ads/ads-routing.module.ts");
/* harmony import */ var _services_ads_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./services/ads.service */ "./src/app/ads/services/ads.service.ts");
/* harmony import */ var _components_ads_ads_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/ads/ads.component */ "./src/app/ads/components/ads/ads.component.ts");
/* harmony import */ var _components_ad_ad_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/ad/ad.component */ "./src/app/ads/components/ad/ad.component.ts");
/* harmony import */ var _components_edit_edit_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/edit/edit.component */ "./src/app/ads/components/edit/edit.component.ts");
















class AdsModule {
}
AdsModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: AdsModule });
AdsModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function AdsModule_Factory(t) { return new (t || AdsModule)(); }, providers: [
        _services_ads_service__WEBPACK_IMPORTED_MODULE_10__["AdsService"]
    ], imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_7__["CommonModule"],
            _angular_material_input__WEBPACK_IMPORTED_MODULE_1__["MatInputModule"],
            _angular_material_card__WEBPACK_IMPORTED_MODULE_2__["MatCardModule"],
            _angular_material_button__WEBPACK_IMPORTED_MODULE_3__["MatButtonModule"],
            _angular_material_divider__WEBPACK_IMPORTED_MODULE_4__["MatDividerModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormsModule"],
            _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__["MatSnackBarModule"],
            _ads_routing_module__WEBPACK_IMPORTED_MODULE_9__["AdsRoutingModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ReactiveFormsModule"],
            _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_8__["MatTooltipModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AdsModule, { declarations: [_components_ads_ads_component__WEBPACK_IMPORTED_MODULE_11__["AdsComponent"],
        _components_ad_ad_component__WEBPACK_IMPORTED_MODULE_12__["AdComponent"],
        _components_edit_edit_component__WEBPACK_IMPORTED_MODULE_13__["AdEditComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_7__["CommonModule"],
        _angular_material_input__WEBPACK_IMPORTED_MODULE_1__["MatInputModule"],
        _angular_material_card__WEBPACK_IMPORTED_MODULE_2__["MatCardModule"],
        _angular_material_button__WEBPACK_IMPORTED_MODULE_3__["MatButtonModule"],
        _angular_material_divider__WEBPACK_IMPORTED_MODULE_4__["MatDividerModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormsModule"],
        _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__["MatSnackBarModule"],
        _ads_routing_module__WEBPACK_IMPORTED_MODULE_9__["AdsRoutingModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ReactiveFormsModule"],
        _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_8__["MatTooltipModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AdsModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [
                    _components_ads_ads_component__WEBPACK_IMPORTED_MODULE_11__["AdsComponent"],
                    _components_ad_ad_component__WEBPACK_IMPORTED_MODULE_12__["AdComponent"],
                    _components_edit_edit_component__WEBPACK_IMPORTED_MODULE_13__["AdEditComponent"]
                ],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_7__["CommonModule"],
                    _angular_material_input__WEBPACK_IMPORTED_MODULE_1__["MatInputModule"],
                    _angular_material_card__WEBPACK_IMPORTED_MODULE_2__["MatCardModule"],
                    _angular_material_button__WEBPACK_IMPORTED_MODULE_3__["MatButtonModule"],
                    _angular_material_divider__WEBPACK_IMPORTED_MODULE_4__["MatDividerModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormsModule"],
                    _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__["MatSnackBarModule"],
                    _ads_routing_module__WEBPACK_IMPORTED_MODULE_9__["AdsRoutingModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ReactiveFormsModule"],
                    _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_8__["MatTooltipModule"]
                ],
                providers: [
                    _services_ads_service__WEBPACK_IMPORTED_MODULE_10__["AdsService"]
                ]
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/ads/components/ad/ad.component.ts":
/*!***************************************************!*\
  !*** ./src/app/ads/components/ad/ad.component.ts ***!
  \***************************************************/
/*! exports provided: AdComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdComponent", function() { return AdComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");



class AdComponent {
    constructor() {
        this.subs = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subscription"]();
    }
    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
AdComponent.ɵfac = function AdComponent_Factory(t) { return new (t || AdComponent)(); };
AdComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AdComponent, selectors: [["ng-component"]], decls: 0, vars: 0, template: function AdComponent_Template(rf, ctx) { }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2Fkcy9jb21wb25lbnRzL2FkL2FkLmNvbXBvbmVudC5zY3NzIn0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AdComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                templateUrl: './ad.component.html',
                styleUrls: ['./ad.component.scss']
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "./src/app/ads/components/ads/ads.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/ads/components/ads/ads.component.ts ***!
  \*****************************************************/
/*! exports provided: AdsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdsComponent", function() { return AdsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");



class AdsComponent {
    constructor() {
        this.subs = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subscription"]();
    }
    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
AdsComponent.ɵfac = function AdsComponent_Factory(t) { return new (t || AdsComponent)(); };
AdsComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AdsComponent, selectors: [["ng-component"]], decls: 0, vars: 0, template: function AdsComponent_Template(rf, ctx) { }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2Fkcy9jb21wb25lbnRzL2Fkcy9hZHMuY29tcG9uZW50LnNjc3MifQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AdsComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                templateUrl: './ads.component.html',
                styleUrls: ['./ads.component.scss']
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "./src/app/ads/components/edit/edit.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/ads/components/edit/edit.component.ts ***!
  \*******************************************************/
/*! exports provided: AdEditComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdEditComponent", function() { return AdEditComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");




class AdEditComponent {
    constructor(route) {
        this.route = route;
        this.subs = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subscription"]();
        this.adId = parseInt(this.route.snapshot.paramMap.get('adId'));
    }
    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
AdEditComponent.ɵfac = function AdEditComponent_Factory(t) { return new (t || AdEditComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"])); };
AdEditComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AdEditComponent, selectors: [["ng-component"]], decls: 0, vars: 0, template: function AdEditComponent_Template(rf, ctx) { }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2Fkcy9jb21wb25lbnRzL2VkaXQvZWRpdC5jb21wb25lbnQuc2NzcyJ9 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AdEditComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                templateUrl: './edit.component.html',
                styleUrls: ['./edit.component.scss']
            }]
    }], function () { return [{ type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"] }]; }, null); })();


/***/ }),

/***/ "./src/app/ads/services/ads.service.ts":
/*!*********************************************!*\
  !*** ./src/app/ads/services/ads.service.ts ***!
  \*********************************************/
/*! exports provided: AdsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdsService", function() { return AdsService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");



class AdsService {
    constructor(http) {
        this.http = http;
    }
}
AdsService.ɵfac = function AdsService_Factory(t) { return new (t || AdsService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"])); };
AdsService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: AdsService, factory: AdsService.ɵfac });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AdsService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"]
    }], function () { return [{ type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] }]; }, null); })();


/***/ })

}]);
//# sourceMappingURL=ads-ads-module.js.map
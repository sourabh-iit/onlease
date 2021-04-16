import { Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { MapService } from "src/admin/services/map.service";

import { ScriptLoadingService } from "src/app/services/loadscript.service";


@Component({
    templateUrl: './map.component.html',
    styleUrls: ['map.component.scss']
})
export class MapComponent implements OnDestroy {
    @ViewChild('mapContainer') mapContainer!: ElementRef;
    private map!: any;
    private subs = new Subscription();
    private data: any = [];

    constructor(
        private scriptLoader: ScriptLoadingService,
        private mapService: MapService
    ) {
        this.loadMapScript();
        this.loadData();
    }

    loadData() {
        this.subs.add(this.mapService.loadLodgings().subscribe((data: any) => {
            this.data = data;
            this.renderMap();
        }));
    }

    loadMapScript() {
        this.scriptLoader.loadScript('googleMap').then(() => {
            this.map = new google.maps.Map(this.mapContainer.nativeElement);
            this.renderMap();
        });
    }

    renderMap() {
        if(this.map && this.data.length > 0) {
            var bounds = new google.maps.LatLngBounds();
            let coordinates: any = [];
            for (var i = 0; i < this.data.length; i++) {
                coordinates = this.data[i].latlng.split(',');
                bounds.extend({
                    lat: parseFloat(coordinates[1]),
                    lng: parseFloat(coordinates[2])
                });
            }
            this.map.fitBounds(bounds);
        }
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
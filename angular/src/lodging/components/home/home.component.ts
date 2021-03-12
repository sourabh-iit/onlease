import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

import { LodgingService } from "src/lodging/services/lodging.service";


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private subs = new Subscription();
  public selectedRegions = [];
  public lodgings = [];
  public loading = false;
  public hasNextPage = true;

  constructor(
    private lodgingService: LodgingService,
    private route: ActivatedRoute
  ){
  }

  ngOnInit() {
    this.loadLodgings();
  }

  loadLodgings() {
    this.loading = true;
    this.subs.add(this.lodgingService.loadLodgings(this.selectedRegions).subscribe((res: any) => {
      this.lodgings = res.data;
      this.loading = false;
      this.hasNextPage = res.has_next_page;
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
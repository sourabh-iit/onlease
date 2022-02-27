import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { finalize } from "rxjs/operators";

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
  public loadingPage = false;
  private currPage = 1;

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
    this.subs.add(this.lodgingService.loadLodgings(this.selectedRegions)
      .pipe(finalize(() => this.loading = false))
      .subscribe((res: any) => {
        this.lodgings = res.data;
        this.hasNextPage = res.has_next_page;
      })
    );
  }

  loadMore() {
    if (this.loadingPage) {
      return;
    }
    this.loadingPage = true;
    this.subs.add(this.lodgingService.loadLodgings(this.selectedRegions, this.currPage+1)
      .pipe(finalize(() => this.loadingPage = false))
      .subscribe((res: any) => {
        this.lodgings = this.lodgings.concat(res.data);
        this.hasNextPage = res.has_next_page;
        this.currPage++;
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
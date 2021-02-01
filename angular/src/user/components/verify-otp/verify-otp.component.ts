import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToasterService } from 'src/app/services/toaster.service';


@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnDestroy {
  public subs = new Subscription();
  public otp = "";
  public time_remaining = 0;
  private intervalId: any;

  @Input()
  set lastOtpSent(v: any) {
    this.setRemainingTime();
    this.toaster.success('Success', 'An otp has been sent to your number');
  }
  @Output() verifyOtp = new EventEmitter();
  @Output() resendOtp = new EventEmitter();

  constructor(
    private toaster: ToasterService
  ) {
    this.setRemainingTime();
  }

  setRemainingTime() {
    this.time_remaining = 2;
    this.intervalId = setInterval(() => {
     this.time_remaining--;
     if(this.time_remaining <= 0) {
       clearInterval(this.intervalId);
     }
    }, 1000);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    clearInterval(this.intervalId);
  }
}

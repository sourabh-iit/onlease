import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'toMinutesAndSeconds'})
export class ToMinutesAndSecondsPipe implements PipeTransform {
  transform(value: number): string {
    const minutes = Math.floor(value/60);
    let seconds;
    if(value%60 < 10) {
      seconds = `0${value%60}`;
    } else {
      seconds = `${value%60}`;
    }
    return `${minutes}:${seconds}`;
  }
}

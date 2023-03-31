import {Pipe, PipeTransform} from "@angular/core";

const YEAR_DURATION_IN_TICKS = 43200;
const MONTH_DURATION_IN_TICKS = 3600;

@Pipe({name: 'TickToGameDate'})
export class TickToGameDatePipe implements PipeTransform {
  transform(tick: number): string {
    return `Year ${Math.floor(tick / YEAR_DURATION_IN_TICKS) + 1} - Month ${(Math.floor(tick / MONTH_DURATION_IN_TICKS) % 12) + 1}`;
  }
}

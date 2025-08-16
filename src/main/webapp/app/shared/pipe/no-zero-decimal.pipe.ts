import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noZeroDecimal',
  standalone: true,
})
export class NoZeroDecimalPipe implements PipeTransform {
  transform(value: number | null | undefined): string | number {
    if (value === null || value === undefined) {
      return '';
    }
    const roundedValue = Math.round(value * 100) / 100;
    if (roundedValue === Math.floor(roundedValue)) {
      return roundedValue;
    } else {
      return roundedValue.toFixed(2);
    }
  }
}

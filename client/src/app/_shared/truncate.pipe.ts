import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    if (value.length > 200) {
      return value.substring(0, 200) + '...';
    }
    return value;
  }
}

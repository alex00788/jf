import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reductionAddress',
  standalone: true
})
export class ReductionAddressPipe implements PipeTransform {

  transform(address: string): string {
    return address.length > 7? address.slice(0, 7) + '...' : address;
  }

}

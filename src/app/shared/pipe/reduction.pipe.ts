import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reductionOrg',
  standalone: true
})
export class ReductionPipe implements PipeTransform {

  transform(nameOrg: string): string {
      return nameOrg.length > 15? nameOrg.slice(0, 15) + '...' : nameOrg;
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterOrg',
  standalone: true
})
export class FilterOrgPipe implements PipeTransform {

  transform(allOrg: any[], searchStr: string): any[] {
    return allOrg.filter((el:any) => el.name.toLowerCase().includes(searchStr.toLowerCase()));
  }

}

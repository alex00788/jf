import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterClientList',
  standalone: true
})
export class FilterClientListPipe implements PipeTransform {

  transform(allUsers: any[], searchStr: string): any[] {
    return allUsers.filter((el:any) => el.surnameUser.toLowerCase().includes(searchStr.toLowerCase()));
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateMonth',
  standalone: true
})
export class TranslateMonthPipe implements PipeTransform {

  monthRus :any[] = ['0','январе', 'феврале', 'марте', 'апреле', 'мае', 'июне', 'июле', 'августе', 'сентябре', 'октябре', 'ноябре', 'декабре']
  transform(value: any,): string {
    return this.monthRus[value].toUpperCase()
  }

}

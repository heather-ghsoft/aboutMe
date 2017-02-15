import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'todoFilter'
})
export class TodoFilter implements PipeTransform {
  transform(items, args: string) { 
    console.log('TodoFilter: items: ', items);
    console.log('TodoFilter: args: ', args);

    if (!items.length) return;
    if (!args) return;

    const filterVal = args;
    if (filterVal === 'ALL') return items;

    const compareFilter = (item) => {
      switch (filterVal) {
        case 'TODO': return !item.completed;
        case 'DONE': return item.completed;
      }
    }
    return items.filter(compareFilter);
  }
}
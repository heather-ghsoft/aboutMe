import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapFilter'
})
export class MapFilter implements PipeTransform {
  transform(items, args: string[]) { 
    console.log('MapFilter: items: ', items);
    console.log('MapFilter: args: ', args);

    if (!items.length) return;
    if (!args) return;
    let key = args[0];
    let value = args[1];

    return items.filter(item => item[key] == value);
  }
}
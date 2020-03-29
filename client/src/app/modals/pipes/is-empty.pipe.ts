import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'isEmpty',
})
export class IsEmptyPipe implements PipeTransform {
    transform<T>(array: T[]): boolean {
        return array.length === 0;
    }
}

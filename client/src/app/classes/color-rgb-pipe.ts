import { Pipe, PipeTransform } from '@angular/core';
import { Color } from '@app/classes/color';

@Pipe({ name: 'rgb' })
export class ColorRgbPipe implements PipeTransform {
    transform(color: Color): string {
        return `rgb(${color.red}, ${color.green}, ${color.blue})`;
    }
}

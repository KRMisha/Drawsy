import { Pipe, PipeTransform } from '@angular/core';
import { Color } from '@app/classes/color';

@Pipe({ name: 'rgba' })
export class ColorRgbaPipe implements PipeTransform {
    transform(color: Color): string {
        return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
    }
}

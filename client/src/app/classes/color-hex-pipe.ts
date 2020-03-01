import { Pipe, PipeTransform } from '@angular/core';
import { Color } from '@app/classes/color';

@Pipe({ name: 'hex' })
export class ColorHexPipe implements PipeTransform {
    transform(color: Color): string {
        return this.componentToHex(color.red) + this.componentToHex(color.green) + this.componentToHex(color.blue);
    }

    private componentToHex(component: number): string {
        const hexBase = 16;
        const hex = Math.round(component).toString(hexBase);
        return hex.length === 1 ? '0' + hex : hex;
    }
}

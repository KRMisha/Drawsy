import { Pipe, PipeTransform } from '@angular/core';
import { Color } from '@app/classes/color';

@Pipe({ name: 'hsv' })
export class ColorHsvPipe implements PipeTransform {
    transform(color: Color): [number, number, number] {
        // All constants are taken from this algorithm:
        // https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB
        // tslint:disable: no-magic-numbers

        const redPrime = color.red / Color.maxRgb;
        const greenPrime = color.green / Color.maxRgb;
        const bluePrime = color.blue / Color.maxRgb;

        const cMax = Math.max(redPrime, greenPrime, bluePrime);
        const cMin = Math.min(redPrime, greenPrime, bluePrime);
        const deltaC = cMax - cMin;

        const angleValue = 60;

        let hue: number;
        if (deltaC === 0) {
            hue = 0;
        } else if (cMax === redPrime) {
            hue = angleValue * (((greenPrime - bluePrime) / deltaC) % 6);
        } else if (cMax === greenPrime) {
            hue = angleValue * ((bluePrime - redPrime) / deltaC + 2);
        } else {
            hue = angleValue * ((redPrime - greenPrime) / deltaC + 4);
        }

        if (hue < 0) {
            hue += Color.maxHue;
        }

        const saturation: number = cMax === 0 ? 0 : deltaC / cMax;

        const value = cMax;

        return [hue, saturation, value];
        // tslint:enable: no-magic-numbers
    }
}

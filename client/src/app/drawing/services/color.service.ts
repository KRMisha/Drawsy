import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color';

const defaultColors = [
    Color.fromHex('fe8a71'),
    Color.fromHex('f6cd61'),
    Color.fromHex('3da4ab'),
    Color.fromHex('fe9c8f'),
    Color.fromHex('ff6f69'),
    Color.fromHex('0392cf'),
    Color.fromHex('7bc043'),
    Color.fromHex('fdf498'),
    Color.fromHex('f37736'),
    Color.fromHex('ee4035'),
];

const defaultPrimaryColor = Color.fromHex('000000');
const defaultSecondaryColor = Color.fromHex('ffffff');

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    private primaryColor = defaultPrimaryColor;
    private secondaryColor = defaultSecondaryColor;

    private lastColors: Color[] = defaultColors;

    swapPrimaryAndSecondaryColors(): void {
        const temp = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = temp;
    }

    setPrimaryColor(color: Color): void {
        const newColor = new Color();
        newColor.red = color.red;
        newColor.green = color.green;
        newColor.blue = color.blue;
        newColor.alpha = color.alpha;
        this.primaryColor = newColor;
        this.addColor(newColor);
    }

    setSecondaryColor(color: Color): void {
        const newColor = new Color();
        newColor.red = color.red;
        newColor.green = color.green;
        newColor.blue = color.blue;
        newColor.alpha = color.alpha;
        this.secondaryColor = newColor;
        this.addColor(newColor);
    }

    getLastColors(): Color[] {
        return this.lastColors;
    }

    getPrimaryColor(): Color {
        return this.primaryColor;
    }

    getSecondaryColor(): Color {
        return this.secondaryColor;
    }

    private addColor(color: Color): void {
        const isColorPresent = (element: Color) =>
            color.red === element.red && color.green === element.green && color.blue === element.blue;
        if (this.lastColors.some(isColorPresent)) {
            return;
        }

        this.lastColors.pop();
        this.lastColors.unshift(color);
    }
}

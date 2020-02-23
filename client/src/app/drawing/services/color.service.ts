import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color';

const maxRecentColors = 10;

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    private primaryColor = new Color();
    private secondaryColor = new Color();

    private lastColors: Color[] = [];

    constructor() {
        for (let i = 0; i < maxRecentColors; i++) {
            this.lastColors.push(new Color());
        }
    }

    swapPrimaryAndSecondaryColors(): void {
        const temp = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = temp;
    }

    setPrimaryColor(color: Color): void {
        this.primaryColor = color;
        this.addColor(color);
    }

    setSecondaryColor(color: Color): void {
        this.secondaryColor = color;
        this.addColor(color);
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

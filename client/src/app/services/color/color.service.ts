import { Injectable } from '@angular/core';
import { Color } from 'src/app/classes/color/color';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    private MAX_RECENT_COLORS = 10;
    private primaryColor: Color;
    private secondaryColor: Color;

    private lastColors: Color[] = [];

    constructor() {
        this.primaryColor = new Color();
        this.secondaryColor = new Color();
        for (let i = 0; i < this.MAX_RECENT_COLORS; i++) {
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
        for (const arrayColor of this.lastColors) {
            const isColorPresent = color.red === arrayColor.red && color.green === arrayColor.green && color.blue === arrayColor.blue;
            if (isColorPresent) {
                return;
            }
        }

        for (let i = this.lastColors.length - 1; i > 0; i--) {
            this.lastColors[i] = this.lastColors[i - 1];
        }
        this.lastColors[0] = color;
    }
}

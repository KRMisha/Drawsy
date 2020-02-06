import { Injectable } from '@angular/core';
import { Color } from 'src/app/classes/color/color';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    private MAX_RECENT_COLORS = 10;
    private primaryColor: Color;
    private secondaryColor: Color;
    private backgroundColor: Color;

    private lastColors: Color[] = [];

    constructor() {
        this.primaryColor = new Color(0, 0, 0, 1);
        this.secondaryColor = new Color(0, 0, 0, 1);
        for (let i = 0; i < this.MAX_RECENT_COLORS; i++) {
            this.lastColors.push(new Color(0, 0, 0, 1));
        }
    }

    addColor(color: Color): void {
        for (const arrayColor of this.lastColors) {
            if (color.rgbEquals(arrayColor)) {
                return;
            }
        }

        for (let i = this.lastColors.length - 1; i > 0; i--) {
            this.lastColors[i] = this.lastColors[i - 1];
        }
        this.lastColors[0] = color;
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

    setBackroundColor(color: Color): void {
        this.backgroundColor = color;
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

    getBackgroundColor(): Color {
        return this.backgroundColor;
    }
}

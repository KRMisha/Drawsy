import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color';
import { Subject } from 'rxjs';

const defaultPrimaryColor = Color.fromHex('000000');
const defaultSecondaryColor = Color.fromHex('7f7f7f');

const defaultColors = [
    defaultPrimaryColor,
    defaultSecondaryColor,
    Color.fromHex('f6cd61'),
    Color.fromHex('3da4ab'),
    Color.fromHex('ff6f69'),
    Color.fromHex('0392cf'),
    Color.fromHex('7bc043'),
    Color.fromHex('fdf498'),
    Color.fromHex('f37736'),
    Color.fromHex('ee4035'),
];

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    private primaryColor = defaultPrimaryColor;
    private secondaryColor = defaultSecondaryColor;

    private previousColors: Color[] = defaultColors;

    private primaryColorChangedSource = new Subject<Color>();
    private secondaryColorChangedSource = new Subject<Color>();

    primaryColorChanged$ = this.primaryColorChangedSource.asObservable(); // tslint:disable-line: member-ordering
    secondaryColorChanged$ = this.secondaryColorChangedSource.asObservable(); // tslint:disable-line: member-ordering

    swapPrimaryAndSecondaryColors(): void {
        const temp = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = temp;
        this.primaryColorChangedSource.next(this.primaryColor);
        this.secondaryColorChangedSource.next(this.secondaryColor);
    }

    setPrimaryColor(color: Color): void {
        this.primaryColor = Color.fromColor(color);
        this.addColor(this.primaryColor);
        this.primaryColorChangedSource.next(this.primaryColor);
    }

    setSecondaryColor(color: Color): void {
        this.secondaryColor = Color.fromColor(color);
        this.addColor(this.secondaryColor);
        this.secondaryColorChangedSource.next(this.secondaryColor);
    }

    getPreviousColors(): Color[] {
        return this.previousColors;
    }

    getPrimaryColor(): Color {
        return this.primaryColor;
    }

    getSecondaryColor(): Color {
        return this.secondaryColor;
    }

    private addColor(color: Color): void {
        const isColorPresent = (element: Color) => color.getHex() === element.getHex();
        const index = this.previousColors.findIndex(isColorPresent);

        if (index === -1) {
            this.previousColors.pop();
            this.previousColors.unshift(color);
        } else {
            this.previousColors[index] = color;
        }
    }
}

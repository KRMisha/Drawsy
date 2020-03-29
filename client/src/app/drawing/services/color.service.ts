import { Injectable } from '@angular/core';
import { Color } from '@app/shared/classes/color';
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
    // tslint:disable: variable-name
    private _primaryColor = defaultPrimaryColor;
    private _secondaryColor = defaultSecondaryColor;
    private _previousColors: Color[] = defaultColors;
    // tslint:enable: variable-name

    private primaryColorChangedSource = new Subject<Color>();
    private secondaryColorChangedSource = new Subject<Color>();

    primaryColorChanged$ = this.primaryColorChangedSource.asObservable(); // tslint:disable-line: member-ordering
    secondaryColorChanged$ = this.secondaryColorChangedSource.asObservable(); // tslint:disable-line: member-ordering

    swapPrimaryAndSecondaryColors(): void {
        const temp = this._primaryColor;
        this._primaryColor = this._secondaryColor;
        this._secondaryColor = temp;
        this.primaryColorChangedSource.next(this._primaryColor);
        this.secondaryColorChangedSource.next(this._secondaryColor);
    }

    get primaryColor(): Color {
        return this._primaryColor;
    }

    set primaryColor(color: Color) {
        this._primaryColor = color.clone();
        this.addColor(this._primaryColor);
        this.primaryColorChangedSource.next(this._primaryColor);
    }

    get secondaryColor(): Color {
        return this._secondaryColor;
    }

    set secondaryColor(color: Color) {
        this._secondaryColor = color.clone();
        this.addColor(this._secondaryColor);
        this.secondaryColorChangedSource.next(this._secondaryColor);
    }

    get previousColors(): Color[] {
        return this._previousColors;
    }

    private addColor(color: Color): void {
        const isColorPresent = (element: Color) => color.getHex() === element.getHex();
        const colorIndex = this._previousColors.findIndex(isColorPresent);

        if (colorIndex === -1) {
            this._previousColors.pop();
            this._previousColors.unshift(color);
        } else {
            this._previousColors[colorIndex] = color;
        }
    }
}

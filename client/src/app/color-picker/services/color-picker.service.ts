import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color';
import { Subject } from 'rxjs';

@Injectable()
export class ColorPickerService {
    color = new Color();

    private hueChangedSource = new Subject<number>();
    private saturationChangedSource = new Subject<number>();
    private valueChangedSource = new Subject<number>();
    private alphaChangedSource = new Subject<number>();
    private colorChangedSource = new Subject<Color>();

    // tslint:disable: member-ordering
    hueChanged$ = this.hueChangedSource.asObservable();
    saturationChanged$ = this.saturationChangedSource.asObservable();
    valueChanged$ = this.valueChangedSource.asObservable();
    alphaChanged$ = this.alphaChangedSource.asObservable();
    colorChanged$ = this.colorChangedSource.asObservable();
    // tslint:enable: member-ordering

    // tslint:disable: variable-name
    private _hue = 0;
    private _saturation = 0;
    private _value = 0;
    private _alpha = 1;
    // tslint:enable: variable-name

    get hue(): number {
        return this._hue;
    }

    set hue(hue: number) {
        this._hue = hue;
        this.emitColorChanged();
        this.hueChangedSource.next(hue);
    }

    get saturation(): number {
        return this._saturation;
    }

    set saturation(saturation: number) {
        this._saturation = saturation;
        this.emitColorChanged();
        this.saturationChangedSource.next(saturation);
    }

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
        this.emitColorChanged();
        this.valueChangedSource.next(value);
    }

    get alpha(): number {
        return this._alpha;
    }

    set alpha(alpha: number) {
        this._alpha = alpha;
        this.emitColorChanged();
        this.alphaChangedSource.next(alpha);
    }

    getColor(): Color {
        this.color.setHsv(this.hue, this.saturation, this.value);
        this.color.alpha = this.alpha;
        return this.color;
    }

    setColor(color: Color): void {
        this.color = Color.fromColor(color);
        this.colorChangedSource.next(color);

        const hsv = this.color.getHsv();
        if (color.red !== color.green || color.green !== color.blue || color.blue !== color.red) {
            this._hue = hsv[0];
        }
        this._saturation = hsv[1];
        this._value = hsv[2];
        this._alpha = color.alpha;

        this.hueChangedSource.next(this.hue);
        this.saturationChangedSource.next(this.saturation);
        this.valueChangedSource.next(this.value);
        this.alphaChangedSource.next(this.alpha);
    }

    getHex(): string {
        return this.getColor().getHex();
    }

    private emitColorChanged(): void {
        this.color.setHsv(this.hue, this.saturation, this.value);
        this.color.alpha = this.alpha;
        this.colorChangedSource.next(Color.fromColor(this.color));
    }
}

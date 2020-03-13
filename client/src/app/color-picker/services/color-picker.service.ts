import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color';
import { Subject } from 'rxjs';

@Injectable()
export class ColorPickerService {
    private hueChangedSource = new Subject<number>();
    private saturationChangedSource = new Subject<number>();
    private valueChangedSource = new Subject<number>();
    private alphaChangedSource = new Subject<number>();
    private colorChangedSource = new Subject<Color>();
    private colorSubmittedSource = new Subject();

    hueChanged$ = this.hueChangedSource.asObservable();
    saturationChanged$ = this.saturationChangedSource.asObservable();
    valueChanged$ = this.valueChangedSource.asObservable();
    alphaChanged$ = this.alphaChangedSource.asObservable();
    colorChanged$ = this.colorChangedSource.asObservable();
    colorSubmitted$ = this.colorSubmittedSource.asObservable();

    color = new Color();

    // tslint:disable: variable-name
    private _hue = 0;
    private _saturation = 0;
    private _value = 0;
    private _alpha = 1;
    // tslint:enable: variable-name

    set hue(hue: number) {
        this._hue = hue;
        this.emitColorChanged();
        this.hueChangedSource.next(hue);
    }

    get hue(): number {
        return this._hue;
    }

    set saturation(saturation: number) {
        this._saturation = saturation;
        this.emitColorChanged();
        this.saturationChangedSource.next(saturation);
    }

    get saturation(): number {
        return this._saturation;
    }

    set value(value: number) {
        this._value = value;
        this.emitColorChanged();
        this.valueChangedSource.next(value);
    }

    get value(): number {
        return this._value;
    }

    set alpha(alpha: number) {
        this._alpha = alpha;
        this.emitColorChanged();
        this.alphaChangedSource.next(alpha);
    }

    get alpha(): number {
        return this._alpha;
    }

    private emitColorChanged(): void {
        this.color.setHsv(this.hue, this.saturation, this.value);
        this.color.alpha = this.alpha;
        this.colorChangedSource.next(Color.fromColor(this.color));
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

    onColorSubmit(): void {
        this.colorSubmittedSource.next();
    }

    getColor(): Color {
        this.color.setHsv(this.hue, this.saturation, this.value);
        this.color.alpha = this.alpha;
        return this.color;
    }

    getHex(): string {
        return this.getColor().getHex();
    }
}

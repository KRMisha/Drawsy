import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorPickerService {
    private hueChangedSource = new Subject<number>();
    private saturationChangedSource = new Subject<number>();
    private valueChangedSource = new Subject<number>();
    private alphaChangedSource = new Subject<number>();
    private colorChangedSource = new Subject<Color>();

    hueChanged$ = this.hueChangedSource.asObservable();
    saturationChanged$ = this.saturationChangedSource.asObservable();
    valueChanged$ = this.valueChangedSource.asObservable();
    alphaChanged$ = this.alphaChangedSource.asObservable();
    colorChanged$ = this.colorChangedSource.asObservable();

    color = new Color();

    // tslint:disable: variable-name
    private hue_ = 0;
    private saturation_ = 0;
    private value_ = 0;    
    private alpha_ = 1;
    // tslint:enable: variable-name

    set hue(hue: number) {
        this.hue_ = hue;
        this.colorChangedSource.next(this.getColor());
        this.hueChangedSource.next(hue);
    }

    get hue(): number {
        return this.hue_;
    }

    set saturation(saturation: number) {
        this.saturation_ = saturation;
        this.colorChangedSource.next(this.getColor());
        this.saturationChangedSource.next(saturation);
    }

    get saturation(): number {
        return this.saturation_;
    }

    set value(value: number) {
        this.value_ = value;
        this.colorChangedSource.next(this.getColor());
        this.valueChangedSource.next(value);
    }

    get value(): number {
        return this.value_;
    }

    set alpha(alpha: number) {
        this.alpha_ = alpha;
        this.colorChangedSource.next(this.getColor());
        this.alphaChangedSource.next(alpha);
    }

    get alpha(): number {
        return this.alpha_;
    }

    setColor(color: Color): void {
        const hsv = color.getHsv();
        this.hue_ = hsv[0];
        this.saturation_ = hsv[1];
        this.value_ = hsv[2];
        this.alpha_ = color.alpha;
        this.colorChangedSource.next(color);
        this.hueChangedSource.next(this.hue);
        this.saturationChangedSource.next(this.saturation);
        this.valueChangedSource.next(this.value);
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

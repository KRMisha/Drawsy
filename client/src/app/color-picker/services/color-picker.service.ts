import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Color } from '../../classes/color/color';

@Injectable({
  providedIn: 'root'
})
export class ColorPickerService {
    private hueChangedSource = new Subject<number>();
    private saturationChangedSource = new Subject<number>();
    private valueChangedSource = new Subject<number>();
    private alphaChangedSource = new Subject<number>();
    private colorChanged = new Subject<Color>();

    hueChanged$ = this.hueChangedSource.asObservable();
    saturationChanged$ = this.saturationChangedSource.asObservable();
    valueChanged$ = this.valueChangedSource.asObservable();
    alphaChanged$ = this.alphaChangedSource.asObservable();
    colorChanged$ = this.colorChanged.asObservable();

    // tslint:disable: variable-name
    private hue_ = 0;
    private saturation_ = 0;
    private value_ = 0;    
    private alpha_ = 1;
    // tslint:enable: variable-name

    set hue(hue: number) {
        this.hue_ = hue;
        this.colorChanged.next(this.getColor());
        this.hueChangedSource.next(hue);
    }

    get hue(): number {
        return this.hue_;
    }

    set saturation(saturation: number) {
        this.saturation_ = saturation;
        this.colorChanged.next(this.getColor());
        this.saturationChangedSource.next(saturation);
    }

    get saturation(): number {
        return this.saturation_;
    }

    set value(value: number) {
        this.value_ = value;
        this.colorChanged.next(this.getColor());
        this.valueChangedSource.next(value);
    }

    get value(): number {
        return this.value_;
    }

    set alpha(alpha: number) {
        this.alpha_ = alpha;
        this.colorChanged.next(this.getColor());
        this.alphaChangedSource.next(alpha);
    }

    get alpha(): number {
        return this.alpha_;
    }

    getColor(): Color {
        const color = new Color();
        color.setHsv(this.hue, this.saturation, this.value);
        color.alpha = this.alpha;
        return color;
    }

    getHex(): string {
        return this.getColor().getHex();
    }
}

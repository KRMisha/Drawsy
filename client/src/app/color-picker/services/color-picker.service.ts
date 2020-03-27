import { Injectable } from '@angular/core';
import { Color } from '@app/shared/classes/color';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ColorPickerService {
    private previousColor: Color;

    private hueChangedSource = new BehaviorSubject<number>(0);
    private saturationChangedSource = new BehaviorSubject<number>(0);
    private valueChangedSource = new BehaviorSubject<number>(0);
    private alphaChangedSource = new BehaviorSubject<number>(1);

    // tslint:disable: member-ordering
    hueChanged$ = this.hueChangedSource.asObservable();
    saturationChanged$ = this.saturationChangedSource.asObservable();
    valueChanged$ = this.valueChangedSource.asObservable();
    alphaChanged$ = this.alphaChangedSource.asObservable();
    // tslint:enable: member-ordering

    get hue(): number {
        return this.hueChangedSource.value;
    }

    set hue(hue: number) {
        this.hueChangedSource.next(hue);
        this.previousColor = this.getColor();
    }

    get saturation(): number {
        return this.saturationChangedSource.value;
    }

    set saturation(saturation: number) {
        this.saturationChangedSource.next(saturation);
        this.previousColor = this.getColor();
    }

    get value(): number {
        return this.valueChangedSource.value;
    }

    set value(value: number) {
        this.valueChangedSource.next(value);
        this.previousColor = this.getColor();
    }

    get alpha(): number {
        return this.alphaChangedSource.value;
    }

    set alpha(alpha: number) {
        this.alphaChangedSource.next(alpha);
        this.previousColor = this.getColor();
    }

    getColor(): Color {
        const color = Color.fromHsv(this.hue, this.saturation, this.value);
        color.alpha = this.alpha;
        return color;
    }

    setColor(color: Color): void {
        if (this.previousColor !== undefined && color.equals(this.previousColor)) {
            return;
        }

        const hsv = color.getHsv();
        this.hueChangedSource.next(hsv[0]);
        this.saturationChangedSource.next(hsv[1]);
        this.valueChangedSource.next(hsv[2]);
        this.alphaChangedSource.next(color.alpha);
    }

    getHex(): string {
        return this.getColor().getHex();
    }
}

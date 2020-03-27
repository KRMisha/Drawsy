import { Injectable } from '@angular/core';
import { Color } from '@app/shared/classes/color';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ColorPickerService {
    private cachedColor = new Color();

    private hueChangedSource = new BehaviorSubject<number>(this.cachedColor.getHsv()[0]);
    private saturationChangedSource = new BehaviorSubject<number>(this.cachedColor.getHsv()[1]);
    private valueChangedSource = new BehaviorSubject<number>(this.cachedColor.getHsv()[2]);
    private alphaChangedSource = new BehaviorSubject<number>(this.cachedColor.alpha);

    // tslint:disable: member-ordering
    hueChanged$ = this.hueChangedSource.asObservable();
    saturationChanged$ = this.saturationChangedSource.asObservable();
    valueChanged$ = this.valueChangedSource.asObservable();
    alphaChanged$ = this.alphaChangedSource.asObservable();
    // tslint:enable: member-ordering

    getColor(): Color {
        return this.cachedColor;
    }

    setColor(color: Color): void {
        if (this.cachedColor !== undefined && color.equals(this.cachedColor)) {
            return;
        }

        this.cachedColor = color;

        const [hue, saturation, value] = color.getHsv();
        this.hueChangedSource.next(hue);
        this.saturationChangedSource.next(saturation);
        this.valueChangedSource.next(value);
        this.alphaChangedSource.next(color.alpha);
    }

    getHex(): string {
        return this.getColor().getHex();
    }

    get hue(): number {
        return this.hueChangedSource.value;
    }

    set hue(hue: number) {
        this.cachedColor = Color.fromHsv(hue, this.saturationChangedSource.value, this.valueChangedSource.value);
        this.cachedColor.alpha = this.alphaChangedSource.value;

        this.hueChangedSource.next(hue);
    }

    get saturation(): number {
        return this.saturationChangedSource.value;
    }

    set saturation(saturation: number) {
        this.cachedColor = Color.fromHsv(this.hueChangedSource.value, saturation, this.valueChangedSource.value);
        this.cachedColor.alpha = this.alphaChangedSource.value;

        this.saturationChangedSource.next(saturation);
    }

    get value(): number {
        return this.valueChangedSource.value;
    }

    set value(value: number) {
        this.cachedColor = Color.fromHsv(this.valueChangedSource.value, this.saturationChangedSource.value, value);
        this.cachedColor.alpha = this.alphaChangedSource.value;

        this.valueChangedSource.next(value);
    }

    get alpha(): number {
        return this.alphaChangedSource.value;
    }

    set alpha(alpha: number) {
        this.cachedColor.alpha = alpha;

        this.alphaChangedSource.next(alpha);
    }
}

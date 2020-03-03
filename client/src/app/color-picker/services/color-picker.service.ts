import { Color } from '@app/classes/color';
import { Subject } from 'rxjs';

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
    private hue_ = 0;
    private saturation_ = 0;
    private value_ = 0;
    private alpha_ = 1;
    // tslint:enable: variable-name

    set hue(hue: number) {
        this.hue_ = hue;
        this.emitColorChanged();
        this.hueChangedSource.next(hue);
    }

    get hue(): number {
        return this.hue_;
    }

    set saturation(saturation: number) {
        this.saturation_ = saturation;
        this.emitColorChanged();
        this.saturationChangedSource.next(saturation);
    }

    get saturation(): number {
        return this.saturation_;
    }

    set value(value: number) {
        this.value_ = value;
        this.emitColorChanged();
        this.valueChangedSource.next(value);
    }

    get value(): number {
        return this.value_;
    }

    set alpha(alpha: number) {
        this.alpha_ = alpha;
        this.emitColorChanged();
        this.alphaChangedSource.next(alpha);
    }

    get alpha(): number {
        return this.alpha_;
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
            this.hue_ = hsv[0];
        }
        this.saturation_ = hsv[1];
        this.value_ = hsv[2];
        this.alpha_ = color.alpha;

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

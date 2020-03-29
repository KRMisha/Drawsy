import { async, TestBed } from '@angular/core/testing';

import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Color } from '@app/shared/classes/color';

// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable: no-magic-numbers

describe('ColorPickerServiceService', () => {
    let service: ColorPickerService;
    let colorSpyObj: jasmine.SpyObj<Color>;
    let subscriberSpyObj: jasmine.SpyObj<any>;

    const initialHue = 0;
    const initialSaturation = 0;
    const initialValue = 78.4;
    const initialAlpha = 1;
    beforeEach(() => {
        colorSpyObj = jasmine.createSpyObj('Color', ['getHsv', 'getHex', 'equals'], {
            red: 200,
            green: 200,
            blue: 200,
            alpha: initialAlpha,
            hue: initialHue,
            saturation: initialSaturation,
            value: initialValue,
        });
        colorSpyObj.getHex.and.returnValue('c8c8c8');
        colorSpyObj.getHsv.and.returnValue([0, 0, 78.4]);
        subscriberSpyObj = jasmine.createSpyObj('Subscriber', ['subscribeLogic']);
        TestBed.configureTestingModule({
            providers: [{ provide: ColorPickerService }],
        });
        service = TestBed.inject(ColorPickerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getColor should return the cached color', () => {
        const color = {} as Color;
        service['cachedColor'] = color;
        const returnValue = service.getColor();
        expect(returnValue).toEqual(color);
    });

    it('#setColor should return early if the color is the same as the cachedColor', async(() => {
        const hueSpy = spyOn(service['hueChangedSource'], 'next');
        const saturationSpy = spyOn(service['saturationChangedSource'], 'next');
        const valueSpy = spyOn(service['valueChangedSource'], 'next');
        const alphaSpy = spyOn(service['alphaChangedSource'], 'next');
        colorSpyObj.equals.and.returnValue(true);
        service.setColor(colorSpyObj);
        expect(hueSpy).not.toHaveBeenCalled();
        expect(saturationSpy).not.toHaveBeenCalled();
        expect(valueSpy).not.toHaveBeenCalled();
        expect(alphaSpy).not.toHaveBeenCalled();
    }));

    it('#setColor should emit to the subscribers if the color is different from cachedColor', async(() => {
        service.hueChanged$.subscribe((hue: number) => {
            subscriberSpyObj.subscribeLogic(hue);
        });
        service.saturationChanged$.subscribe((saturation: number) => {
            subscriberSpyObj.subscribeLogic(saturation);
        });
        service.valueChanged$.subscribe((value: number) => {
            subscriberSpyObj.subscribeLogic(value);
        });
        service.alphaChanged$.subscribe((alpha: number) => {
            subscriberSpyObj.subscribeLogic(alpha);
        });

        colorSpyObj.equals.and.returnValue(false);
        service.setColor(colorSpyObj);
        expect(subscriberSpyObj.subscribeLogic).toHaveBeenCalledWith(initialHue);
        expect(subscriberSpyObj.subscribeLogic).toHaveBeenCalledWith(initialSaturation);
        expect(subscriberSpyObj.subscribeLogic).toHaveBeenCalledWith(initialValue);
        expect(subscriberSpyObj.subscribeLogic).toHaveBeenCalledWith(initialAlpha);
    }));

    it("#getHex should return the cachedColor's hex string", () => {
        service['cachedColor'] = colorSpyObj;
        const returnValue = service.getHex();
        expect(returnValue).toEqual('c8c8c8');
    });

    it("#get hue should return the hueChangedSource's value", () => {
        service['hueChangedSource'].next(20);
        const returnValue = service.hue;
        expect(returnValue).toEqual(20);
    });

    it("#setHue should update the cachedColor and update hueChangedSource's subscribers", () => {
        service.hueChanged$.subscribe((hue: number) => {
            subscriberSpyObj.subscribeLogic(hue);
        });
        service['cachedColor'].alpha = 0;
        const color = { hue: 0.3, alpha: 1 };
        service['alphaChangedSource'].next(color.alpha);
        service.hue = color.hue;
        expect(service['cachedColor'].alpha).toEqual(color.alpha);
        expect(subscriberSpyObj.subscribeLogic).toHaveBeenCalledWith(color.hue);
    });

    it("#get saturation should return saturationChangedSource's value", () => {
        service['saturationChangedSource'].next(10);
        const returnValue = service.saturation;
        expect(returnValue).toEqual(10);
    });

    it("#set saturation should update the cachedColor and update saturationChangedSource's subscribers", () => {
        service.saturationChanged$.subscribe((saturation: number) => {
            subscriberSpyObj.subscribeLogic(saturation);
        });
        service['cachedColor'].alpha = 0;
        const color = { saturation: 0.3, alpha: 1 };
        service['alphaChangedSource'].next(color.alpha);
        service.saturation = color.saturation;
        expect(service['cachedColor'].alpha).toEqual(color.alpha);
        expect(subscriberSpyObj.subscribeLogic).toHaveBeenCalledWith(color.saturation);
    });

    it("#get value should return valueChangedSource's", () => {
        service['valueChangedSource'].next(30);
        const returnValue = service.value;
        expect(returnValue).toEqual(30);
    });

    it("#set value should update the cachedColor and update valueChangedSource's subscribers", () => {
        service.valueChanged$.subscribe((value: number) => {
            subscriberSpyObj.subscribeLogic(value);
        });
        service['cachedColor'].alpha = 0;
        const color = { value: 3, alpha: 1 };
        service['alphaChangedSource'].next(color.alpha);
        service.value = color.value;
        expect(service['cachedColor'].alpha).toEqual(color.alpha);
        expect(subscriberSpyObj.subscribeLogic).toHaveBeenCalledWith(color.value);
    });

    it("#get alpha should return aphaChangedSource's value", () => {
        service['alphaChangedSource'].next(0.4);
        const returnValue = service.alpha;
        expect(returnValue).toEqual(0.4);
    });

    it("#set value should update the cachedColor and update valueChangedSource's subscribers", () => {
        service.alphaChanged$.subscribe((alpha: number) => {
            subscriberSpyObj.subscribeLogic(alpha);
        });
        service['cachedColor'].alpha = 0;
        const color = { alpha: 1 };
        service['alphaChangedSource'].next(color.alpha);
        service.alpha = color.alpha;
        expect(service['cachedColor'].alpha).toEqual(color.alpha);
        expect(subscriberSpyObj.subscribeLogic).toHaveBeenCalledWith(color.alpha);
    });
});

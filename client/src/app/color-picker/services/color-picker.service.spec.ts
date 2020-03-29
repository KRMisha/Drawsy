import { TestBed } from '@angular/core/testing';

import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Color } from '@app/shared/classes/color';

// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable: no-magic-numbers

fdescribe('ColorPickerServiceService', () => {
    let service: ColorPickerService;
    let colorSpyObj: jasmine.SpyObj<Color>;
    let subscriberSpyObj: jasmine.SpyObj<any>;

    const initialHue = 0;
    const initialSaturation = 0;
    const initialValue = 78.4;
    const initialAlpha = 1;
    beforeEach(() => {
        colorSpyObj = jasmine.createSpyObj('Color', [
            'getHsv',
            'getHex',
        ], {
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

    it('#setColor should return early if the color is the same as the cachedColor', () => {
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
        const color = {} as Color;
        service['cachedColor'] = color;
        service.setColor(color);
        expect(subscriberSpyObj.subscribeLogic).not.toHaveBeenCalled();
        expect(subscriberSpyObj.subscribeLogic).not.toHaveBeenCalled();
        expect(subscriberSpyObj.subscribeLogic).not.toHaveBeenCalled();
        expect(subscriberSpyObj.subscribeLogic).not.toHaveBeenCalled();
    });

    it('#setColor should emit to the subscribers if the color is different from cachedColor', () => {
        expect(subscriberSpyObj.subscribeLogic).toHaveBeenCalledWith(initialHue);
        expect(subscriberSpyObj.subscribeLogic).toHaveBeenCalledWith(initialSaturation);
        expect(subscriberSpyObj.subscribeLogic).toHaveBeenCalledWith(initialValue);
        expect(subscriberSpyObj.subscribeLogic).toHaveBeenCalledWith(initialAlpha);
    });
});

import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/drawing/services/color.service';
import { Color } from '@app/shared/classes/color';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('ColorService', () => {
    let service: ColorService;
    let colorSpyObj: jasmine.SpyObj<Color>;
    let defaultColors: Color[];

    beforeEach(() => {
        service = TestBed.inject(ColorService);
        colorSpyObj = jasmine.createSpyObj('Color', ['clone', 'getHex']);
        colorSpyObj.clone.and.returnValue(colorSpyObj);
        colorSpyObj.getHex.and.returnValue('some color');
        defaultColors = [colorSpyObj, colorSpyObj];
        service['_primaryColor'] = colorSpyObj;
        service['_secondaryColor'] = colorSpyObj;
        service['_lastColors'] = defaultColors;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#swapPrimaryAndSecondaryColors should swap the primary and secondary colors', () => {
        const primaryColorChangedSpy = spyOn(service['primaryColorChangedSource'], 'next');
        const secondaryColorChangedSpy = spyOn(service['secondaryColorChangedSource'], 'next');
        const primaryColor = {} as Color;
        const secondaryColor = {} as Color;

        service['_primaryColor'] = primaryColor;
        service['_secondaryColor'] = secondaryColor;

        service.swapPrimaryAndSecondaryColors();

        expect(service['_primaryColor']).toBe(secondaryColor);
        expect(service['_secondaryColor']).toBe(primaryColor);
        expect(primaryColorChangedSpy).toHaveBeenCalledWith(secondaryColor);
        expect(secondaryColorChangedSpy).toHaveBeenCalledWith(primaryColor);
    });

    it('#get primaryColor should return the primary color', () => {
        expect(service.primaryColor).toEqual(colorSpyObj);
    });

    it('#set primaryColor should set the primary color and add it to the last colors', () => {
        const primaryColorChangedSpy = spyOn(service['primaryColorChangedSource'], 'next');
        const addColorSpy = spyOn<any>(service, 'addColor'); // tslint:disable-line: no-any

        service.primaryColor = colorSpyObj;

        expect(colorSpyObj.clone).toHaveBeenCalled();
        expect(service['_primaryColor']).toBe(colorSpyObj);
        expect(addColorSpy).toHaveBeenCalledWith(colorSpyObj);
        expect(primaryColorChangedSpy).toHaveBeenCalledWith(colorSpyObj);
    });

    it('#get secondaryColor should return the secondary color', () => {
        expect(service.secondaryColor).toEqual(colorSpyObj);
    });

    it('#set secondaryColor should set the secondary color and add it to the last colors', () => {
        const secondaryColorChangedSpy = spyOn(service['secondaryColorChangedSource'], 'next');
        const addColorSpy = spyOn<any>(service, 'addColor'); // tslint:disable-line: no-any

        service.secondaryColor = colorSpyObj;

        expect(colorSpyObj.clone).toHaveBeenCalled();
        expect(service['_secondaryColor']).toEqual(colorSpyObj);
        expect(addColorSpy).toHaveBeenCalledWith(colorSpyObj);
        expect(secondaryColorChangedSpy).toHaveBeenCalledWith(colorSpyObj);
    });

    it('#get lastColors should return the array of last colors', () => {
        expect(service.lastColors).toEqual(defaultColors);
    });

    it("#addColor should use an arrow function to verify if the color already exists in the array's findIndex method", () => {
        const findIndexSpy = spyOn(service['_lastColors'], 'findIndex').and.callThrough();
        service['addColor'](colorSpyObj);
        expect(findIndexSpy).toHaveBeenCalled();
        expect(colorSpyObj.getHex).toHaveBeenCalled();
    });

    it('#addColor should add a new color to lastColors', () => {
        const lastColorFindIndexSpy = spyOn(service['_lastColors'], 'findIndex').and.returnValue(-1);
        const lastColorPopSpy = spyOn(service['_lastColors'], 'pop');
        const lastColorUnshiftSpy = spyOn(service['_lastColors'], 'unshift');

        service['addColor'](colorSpyObj);

        expect(lastColorFindIndexSpy).toHaveBeenCalled();
        expect(lastColorPopSpy).toHaveBeenCalled();
        expect(lastColorUnshiftSpy).toHaveBeenCalledWith(colorSpyObj);
    });

    it('#addColor should keep the same color if it is already present in lastColors', () => {
        const lastColorFindIndexSpy = spyOn(service['_lastColors'], 'findIndex').and.returnValue(1);

        service['addColor'](colorSpyObj);

        expect(lastColorFindIndexSpy).toHaveBeenCalled();
        expect(service['_lastColors'][1]).toBe(colorSpyObj);
    });
});

import { TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/color';
import { ColorService } from './color.service';

// tslint:disable: no-magic-numbers

describe('ColorService', () => {
    let service: ColorService;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.get(ColorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("colors should be added to the list if their rgb value does not match any color's rgb value in the array", () => {
        const color1 = new Color();
        color1.red = 1;
        const color2 = new Color();
        color2.blue = 2;
        const color3 = new Color();
        color3.blue = color2.blue;
        color3.alpha = 0.5;
        service.setPrimaryColor(color1);
        service.setSecondaryColor(color2);
        service.setPrimaryColor(color3);
        expect(service.getLastColors()[0]).toEqual(color2);
        expect(service.getLastColors()[1]).toEqual(color1);
        expect(service.getLastColors()[2]).toEqual(new Color());
    });

    it('#swapPrimaryAndSecondaryColors should swap the primary and secondary color attribute', () => {
        const color1 = new Color();
        color1.red = 10;
        const color2 = new Color();
        color2.red = 100;
        service.setPrimaryColor(color1);
        service.setSecondaryColor(color2);
        service.swapPrimaryAndSecondaryColors();
        expect(service.getPrimaryColor()).toEqual(color2);
        expect(service.getSecondaryColor()).toEqual(color1);
    });
});

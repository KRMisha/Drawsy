import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/drawing/services/color.service';
// import { Color } from '@app/shared/classes/color';

// tslint:disable: no-magic-numbers

describe('ColorService', () => {
    let service: ColorService;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ColorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // it("colors should be added to the list if their rgb value does not match any color's rgb value in the array", () => {
    //     const color1 = new Color();
    //     color1.red = 1;
    //     const color2 = new Color();
    //     color2.blue = 2;
    //     const color3 = new Color();
    //     color3.blue = color2.blue;
    //     color3.alpha = 0.5;
    //     service.primaryColor = color1;
    //     service.secondaryColor = color2;
    //     service.secondaryColor = color3;
    //     expect(service.getPreviousColors()[0]).toEqual(color2);
    //     expect(service.getPreviousColors()[1]).toEqual(color1);
    //     expect(service.getPreviousColors()[2]).toEqual(new Color());
    // });

    // it('#swapPrimaryAndSecondaryColors should swap the primary and secondary color attribute', () => {
    //     const color1 = new Color();
    //     color1.red = 10;
    //     const color2 = new Color();
    //     color2.red = 100;
    //     service.primaryColor = color1;
    //     service.secondaryColor = color2;
    //     service.swapPrimaryAndSecondaryColors();
    //     expect(service.primaryColor).toEqual(color2);
    //     expect(service.secondaryColor).toEqual(color1);
    // });
});

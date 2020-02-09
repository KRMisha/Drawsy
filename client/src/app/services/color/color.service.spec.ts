import { TestBed } from '@angular/core/testing';
import { Color } from 'src/app/classes/color/color';
import { ColorService } from './color.service';

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
});

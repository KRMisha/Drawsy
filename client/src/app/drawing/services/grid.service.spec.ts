import { TestBed } from '@angular/core/testing';
import { GridService } from '@app/drawing/services/grid.service';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers

describe('GridService', () => {
    let service: GridService;
    const gridSizeVariation = 5;
    const minSize = 10;
    const maxSize = 250;
    const minOpacity = 0.1;
    const maxOpacity = 1;

    beforeEach(() => {
        service = TestBed.inject(GridService);
    });

    it('should be created', () => {
        service = TestBed.inject(GridService);
        expect(service).toBeTruthy();
    });

    it('#toggleDisplay should reverse isDisplayEnabled boolean value', () => {
        service.isDisplayEnabled = false;
        service.toggleDisplay();
        expect(service.isDisplayEnabled).toEqual(true);
    });

    it('#increaseSize should add gridSizeVariation to size if size is a multiple of gridSizeVariation and the result is in bounds', () => {
        const initialSize = gridSizeVariation * 3;
        const expectedSize = initialSize + gridSizeVariation;
        service['_size'] = initialSize;
        service.increaseSize();
        expect(service['_size']).toEqual(expectedSize);
    });

    it(
        '#increaseSize should round size to the closest superior multiple of gridSizeVariation if size is not a multiple of ' +
            'gridSizeVariation and the result is in bounds',
        () => {
            const initialSize = gridSizeVariation * 3 + 1;
            const expectedSize = gridSizeVariation * 3;
            service['_size'] = initialSize;
            service.increaseSize();
            expect(service['_size']).toEqual(expectedSize);
        }
    );

    it('#increaseSize should keep size at maxSize if increasing size brings it higher than maxSize', () => {
        service['_size'] = maxSize;
        service.increaseSize();
        expect(service['_size']).toEqual(maxSize);
    });

    // tslint:disable-next-line: max-line-length
    it('#decreaseSize should substract gridSizeVariation to size if size is a multiple of gridSizeVariation and the result is in bounds', () => {
        const initialSize = gridSizeVariation * 3;
        const expectedSize = initialSize - gridSizeVariation;
        service['_size'] = initialSize;
        service.decreaseSize();
        expect(service['_size']).toEqual(expectedSize);
    });

    it(
        '#decreaseSize should round size to the closest inferior multiple of gridSizeVariation if size is not a multiple of ' +
            'gridSizeVariation and the result is in bounds',
        () => {
            const initialSize = gridSizeVariation * 3 - 1;
            const expectedSize = gridSizeVariation * 2;
            service['_size'] = initialSize;
            service.decreaseSize();
            expect(service['_size']).toEqual(expectedSize);
        }
    );

    it('#decreaseSize should keep size at minSize if decreasing size brings it lower than maxSize', () => {
        service['_size'] = minSize;
        service.decreaseSize();
        expect(service['_size']).toEqual(minSize);
    });

    it('#set size should set to maxSize if the size is higher than maxSize', () => {
        service.size = maxSize + 1;
        expect(service.size).toEqual(maxSize);
    });

    it('#set size should set to minSize if the size is lower than minSize', () => {
        service.size = minSize - 1;
        expect(service.size).toEqual(minSize);
    });

    it('#set size should set the value if the value of size is in bounds', () => {
        const expectedSize = 100;
        service.size = expectedSize;
        expect(service.size).toEqual(expectedSize);
    });

    it('#set opacity should set to maxOpacity if the opacity is higher than maxOpacity', () => {
        service.opacity = maxOpacity + 1;
        expect(service.opacity).toEqual(maxOpacity);
    });

    it('#set opacity should set to minOpacity if the opacity is lower than minOpacity', () => {
        service.opacity = minOpacity - 1;
        expect(service.opacity).toEqual(minOpacity);
    });

    it('#set opacity should set the value if the value of opacity is in bounds', () => {
        const expectedOpacity = 0.5;
        service.opacity = expectedOpacity;
        expect(service.opacity).toEqual(expectedOpacity);
    });
});

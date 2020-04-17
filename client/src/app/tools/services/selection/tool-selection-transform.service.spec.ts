import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolSelectionTransformService } from '@app/tools/services/selection/tool-selection-transform.service';

describe('ToolSelectionTransformService', () => {
    let drawingRootSpyObj: jasmine.SpyObj<SVGSVGElement>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let service: ToolSelectionTransformService;

    beforeEach(() => {
        drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['createSVGTransform']);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], {
            drawingRoot: drawingRootSpyObj,
        });
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpyObj }],
        }).compileComponents();
        service = TestBed.inject(ToolSelectionTransformService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getElementListTransformsCopy should return an array containing arrays of the transforms of each element', () => {
        const baseValSpyObj = jasmine.createSpyObj('SVGTransformList', ['getItem'], { numberOfItems: 2 });
        const matrixMock = {} as DOMMatrix;
        const itemMock = { matrix: matrixMock } as SVGTransform;
        baseValSpyObj.getItem.and.returnValue(itemMock);
        const transformMock = { baseVal: baseValSpyObj } as SVGAnimatedTransformList;
        const elementMock = { transform: transformMock } as SVGGraphicsElement;
        const elementsMock = [elementMock, elementMock];

        const svgTransformSpyObj = jasmine.createSpyObj('SVGTransform', ['setMatrix']);
        drawingRootSpyObj.createSVGTransform.and.returnValue(svgTransformSpyObj);

        const returnValue = service.getElementListTransformsCopy(elementsMock);
        expect(svgTransformSpyObj.setMatrix).toHaveBeenCalledWith(matrixMock);
        expect(returnValue).toEqual([
            [svgTransformSpyObj, svgTransformSpyObj],
            [svgTransformSpyObj, svgTransformSpyObj],
        ]);
    });

    it('#initializeElementTransforms should call appendItem until every element has 2 transforms', () => {
        const svgTransformMock = {} as SVGTransform;
        drawingRootSpyObj.createSVGTransform.and.returnValue(svgTransformMock);
        const baseValMock = { numberOfItems: 0, appendItem(svgTransform: SVGTransform): void {} }; // tslint:disable-line: no-empty
        const appendItemSpy = spyOn(baseValMock, 'appendItem').and.callFake((svgTransform: SVGTransform) => {
            baseValMock.numberOfItems++;
        });
        const transformMock = ({ baseVal: baseValMock } as unknown) as SVGAnimatedTransformList;
        const elementMock = { transform: transformMock } as SVGGraphicsElement;
        const elementsMock = [elementMock];
        service.initializeElementTransforms(elementsMock);
        expect(appendItemSpy).toHaveBeenCalledWith(svgTransformMock);
        // tslint:disable-next-line: no-magic-numbers
        expect(appendItemSpy).toHaveBeenCalledTimes(2);
    });
});

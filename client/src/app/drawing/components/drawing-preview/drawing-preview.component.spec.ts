import { Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { DrawingPreviewComponent } from '@app/drawing/components/drawing-preview/drawing-preview.component';
import { DrawingFilter } from '@app/drawing/enums/drawing-filter.enum';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';

describe('DrawingPreviewComponent', () => {
    let component: DrawingPreviewComponent;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let colorSpyObj: jasmine.SpyObj<Color>;
    let filterSpyObj: jasmine.SpyObj<SVGFilterElement>;
    let svgElementSpyObj: jasmine.SpyObj<SVGGraphicsElement>;
    let drawingRootSpyObj: jasmine.SpyObj<SVGSVGElement>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;

    let svgSpyObjElementArray: SVGGraphicsElement[];
    let svgFilterSpyObjArray: SVGFilterElement[];

    const initialDimensions: Vec2 = { x: 10, y: 10 };
    const toRgbaStringValue = 'rgba(1, 1, 1, 1)';
    const drawingLabels = ['Label', 'lAbEl', 'please'];
    const initialTitle = 'Title';

    beforeEach(async(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['appendChild', 'createText']);
        colorSpyObj = jasmine.createSpyObj('Color', ['toRgbaString']);
        colorSpyObj.toRgbaString.and.returnValue(toRgbaStringValue);

        filterSpyObj = jasmine.createSpyObj('SVGFilterElement', ['cloneNode']);
        svgFilterSpyObjArray = [filterSpyObj, filterSpyObj, filterSpyObj];
        svgElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['cloneNode']);
        svgSpyObjElementArray = [svgElementSpyObj, svgElementSpyObj, svgElementSpyObj];
        const defsSpyObj = jasmine.createSpyObj('SVGDefsElement', ['getElementsByTagName']);
        defsSpyObj.getElementsByTagName.and.returnValue(svgFilterSpyObjArray);
        drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getElementsByTagName']);
        drawingRootSpyObj.getElementsByTagName.and.returnValue([defsSpyObj] as any); // tslint:disable-line: no-any

        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], {
            drawingRoot: drawingRootSpyObj,
            elements: svgSpyObjElementArray,
            dimensions: initialDimensions,
            backgroundColor: colorSpyObj,
            labels: drawingLabels,
            title: initialTitle,
        });

        TestBed.configureTestingModule({
            declarations: [DrawingPreviewComponent],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: Renderer2, useValue: renderer2SpyObj },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        const fixture = TestBed.createComponent(DrawingPreviewComponent);
        component = fixture.componentInstance;
        component['renderer'] = renderer2SpyObj; // tslint:disable-line: no-string-literal
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("#ngAfterViewInit should clone every filter and element of the drawingService's root", () => {
        // No need to call the ngAfterViewInit manually since it is already called by jasmine during component creation
        expect(filterSpyObj.cloneNode).toHaveBeenCalledTimes(svgFilterSpyObjArray.length);
        expect(svgElementSpyObj.cloneNode).toHaveBeenCalledTimes(svgSpyObjElementArray.length);
        expect(renderer2SpyObj.appendChild).toHaveBeenCalledTimes(svgFilterSpyObjArray.length + svgSpyObjElementArray.length);
    });

    it('getDrawingFilter should return null if the drawingFilter is None', () => {
        component.drawingFilter = DrawingFilter.None;
        const actualValue = component.getDrawingFilter();
        expect(actualValue).toBeNull();
    });

    it('getDrawingFilter should return the drawingFilter attribute string if the drawingFilter is not None', () => {
        component.drawingFilter = DrawingFilter.BlackAndWhite;
        const actualValue = component.getDrawingFilter();
        expect(actualValue).toEqual(`url(#drawingFilter${component.drawingFilter})`);
    });

    it('#get viewBox should return the viewBox dimensions string', () => {
        const returnedValue = component.viewBox;
        expect(returnedValue).toEqual('0 0 10 10');
    });

    it("#get drawingTitle should return the drawingService's title", () => {
        expect(component.drawingTitle).toEqual(initialTitle);
    });

    it("#get drawingLabels should return the drawingService's labels as a csv format", () => {
        expect(component.drawingLabels).toEqual('Label,lAbEl,please');
    });

    it('#get backgroundColor should return the color in rgba string', () => {
        const returnedValue = component.backgroundColor;
        expect(colorSpyObj.toRgbaString).toHaveBeenCalled();
        expect(returnedValue).toEqual(toRgbaStringValue);
    });
});

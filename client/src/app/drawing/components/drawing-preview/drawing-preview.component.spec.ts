import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingPreviewComponent } from '@app/drawing/components/drawing-preview/drawing-preview.component';
import { DrawingFilter } from '@app/drawing/enums/drawing-filter.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';

// tslint:disable: no-string-literal

fdescribe('DrawingPreviewComponent', () => {
    let component: DrawingPreviewComponent;
    let fixture: ComponentFixture<DrawingPreviewComponent>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let colorSpyObj: jasmine.SpyObj<Color>;
    let drawingPreviewServiceSpyObj: jasmine.SpyObj<DrawingPreviewService>;
    const initialDimensions: Vec2 = { x: 10, y: 10 };
    const toRgbaStringValue = 'rgba(1, 1, 1, 1)';

    beforeEach(async(() => {
        colorSpyObj = jasmine.createSpyObj('Color', ['toRgbaString']);
        colorSpyObj.toRgbaString.and.returnValue(toRgbaStringValue);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], {
            dimensions: initialDimensions,
            backgroundColor: colorSpyObj,
        });
        drawingPreviewServiceSpyObj = jasmine.createSpyObj('DrawingPreviewService', ['initializePreview']);
        TestBed.configureTestingModule({
            declarations: [DrawingPreviewComponent],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: DrawingPreviewService, useValue: drawingPreviewServiceSpyObj },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingPreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#ngOnDestroy should delete all the attributes from the component and call initializePreview from drawingPreviewService', () => {
        const expectedDrawingRoot = {} as SVGSVGElement;
        const expectedSvgTitle = {} as SVGTitleElement;
        const expectedSvgDesc = {} as SVGDescElement;
        const expectedSvgDefs = {} as SVGDefsElement;
        const expectedSvgDrawingContent = {} as SVGGElement;

        component['drawingRoot'].nativeElement = expectedDrawingRoot;
        component['svgTitle'].nativeElement = expectedSvgTitle;
        component['svgDesc'].nativeElement = expectedSvgDesc;
        component['svgDefs'].nativeElement = expectedSvgDefs;
        component['svgDrawingContent'].nativeElement = expectedSvgDrawingContent;

        const drawingPreviewServiceMock = {
            drawingPreviewRoot: (undefined as unknown) as SVGSVGElement,
            svgTitle: (undefined as unknown) as SVGTitleElement,
            svgDesc: (undefined as unknown) as SVGDescElement,
            svgDefs: (undefined as unknown) as SVGDefsElement,
            svgDrawingContent: (undefined as unknown) as SVGGElement,
            initializePreview(): void {}, // tslint:disable-line: no-empty
        } as DrawingPreviewService;

        const initializePreviewSpy = spyOn(drawingPreviewServiceMock, 'initializePreview');
        component['drawingPreviewService'] = drawingPreviewServiceMock;
        component.ngAfterViewInit();

        expect(drawingPreviewServiceMock.drawingPreviewRoot).toBe(expectedDrawingRoot);
        expect(drawingPreviewServiceMock.svgTitle).toBe(expectedSvgTitle);
        expect(drawingPreviewServiceMock.svgDesc).toBe(expectedSvgDesc);
        expect(drawingPreviewServiceMock.svgDefs).toBe(expectedSvgDefs);
        expect(drawingPreviewServiceMock.svgDrawingContent).toBe(expectedSvgDrawingContent);
        expect(initializePreviewSpy).toHaveBeenCalled();
    });

    it('#ngOnDestroy should delete all the attributes from the component', () => {
        const drawingPreviewServiceMock = {
            drawingPreviewRoot: {} as SVGSVGElement,
            svgTitle: {} as SVGTitleElement,
            svgDesc: {} as SVGDescElement,
            svgDefs: {} as SVGDefsElement,
            svgDrawingContent: {} as SVGGElement,
        } as DrawingPreviewService;

        component['drawingPreviewService'] = drawingPreviewServiceMock;
        component.ngOnDestroy();

        expect(component['drawingPreviewService'].drawingPreviewRoot).toBe((undefined as unknown) as SVGSVGElement);
        expect(component['drawingPreviewService'].svgTitle).toBe((undefined as unknown) as SVGTitleElement);
        expect(component['drawingPreviewService'].svgDesc).toBe((undefined as unknown) as SVGDescElement);
        expect(component['drawingPreviewService'].svgDefs).toBe((undefined as unknown) as SVGDefsElement);
        expect(component['drawingPreviewService'].svgDrawingContent).toBe((undefined as unknown) as SVGGElement);
    });

    it('#get viewBox should return the viewBox dimensions string', () => {
        const returnedValue = component.viewBox;
        expect(returnedValue).toEqual('0 0 10 10');
    });

    it('#get backgroundColor should return the color in rgba string', () => {
        const returnedValue = component.backgroundColor;
        expect(colorSpyObj.toRgbaString).toHaveBeenCalled();
        expect(returnedValue).toEqual(toRgbaStringValue);
    });

    it('#get drawing should return null if there is no filter', () => {
        component['drawingPreviewService'].drawingFilter = DrawingFilter.None;
        expect(component.drawingFilter).toEqual(null);
    });

    it('#get drawing should return null if there is a filter', () => {
        component['drawingPreviewService'].drawingFilter = DrawingFilter.BlackAndWhite;
        expect(component.drawingFilter).toEqual('url(#drawingFilter1)');
    });
});

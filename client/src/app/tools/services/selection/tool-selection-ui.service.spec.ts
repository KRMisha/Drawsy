import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionUiService } from '@app/tools/services/selection/tool-selection-ui.service';
import { Subject } from 'rxjs';
import { ToolSelectionCollisionService } from './tool-selection-collision.service';

// tslint:disable: no-string-literal
// tslint:disable: no-any

describe('ToolSelectionUiService', () => {
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let toolSelectionCollisionServiceSpyObj: jasmine.SpyObj<ToolSelectionCollisionService>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let toolSelectionStateServiceSpyObj: jasmine.SpyObj<ToolSelectionStateService>;

    let selectedElementsChangedSubject: Subject<SVGGraphicsElement[]>;

    let service: ToolSelectionUiService;

    const controlPointsCount = 4;
    let hideSvgSelectedShapesRectSpy: any;

    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement']);
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        toolSelectionCollisionServiceSpyObj = jasmine.createSpyObj('ToolSelectionCollisionService', [
            'getElementListBounds',
        ]);

        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['addUiElement', 'removeUiElement']);

        selectedElementsChangedSubject = new Subject<SVGGraphicsElement[]>();
        toolSelectionStateServiceSpyObj = jasmine.createSpyObj('ToolSelectionStateService', ['updateSelectionRect'], {
            selectedElementsChanged$: selectedElementsChangedSubject,
        });

        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: ToolSelectionCollisionService, useValue: toolSelectionCollisionServiceSpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ToolSelectionStateService, useValue: toolSelectionStateServiceSpyObj },
            ],
        });
        service = TestBed.inject(ToolSelectionUiService);

        hideSvgSelectedShapesRectSpy = spyOn<any>(service, 'hideSvgSelectedShapesRect').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#constructor should set correct attributes to the 4 control points', () => {
        for (let i = 0; i < controlPointsCount; i++) {
            const controlPointSideSize = '10';
            expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(
                service['svgControlPoints'][controlPointsCount],
                'width',
                controlPointSideSize
            );
            expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(
                service['svgControlPoints'][controlPointsCount],
                'height',
                controlPointSideSize
            );
            expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(service['svgControlPoints'][controlPointsCount], 'fill', 'black');
            expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(
                service['svgControlPoints'][controlPointsCount],
                'pointer-events',
                'auto'
            );
        }
    });

    it('#selectedElementsChangedSubscription should update svg rect', () => {
        const updateSvgSelectedShapesRectSpy = spyOn<any>(service, 'updateSvgSelectedShapesRect');
        selectedElementsChangedSubject.next([{} as SVGGraphicsElement]);
        expect(updateSvgSelectedShapesRectSpy).toHaveBeenCalled();
    });

    it('#ngOnDestroy should unsubscribe from electedElementsChanged event', () => {
        const unsubscribeSpy = spyOn<any>(service['selectedElementsChangedSubscription'], 'unsubscribe');
        service.ngOnDestroy();
        expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('#updateSvgSelectedShapesRect should hide selected shapes rect if the elements bounds is undefined', () => {
        toolSelectionCollisionServiceSpyObj.getElementListBounds.and.returnValue(undefined);
        service.updateSvgSelectedShapesRect({} as SVGGraphicsElement[]);
        expect(hideSvgSelectedShapesRectSpy).toHaveBeenCalled();
    });

    it('#updateSvgSelectedShapesRect should change the position of the box around selected elements', () => {
        const selectionRect = { x: 69, y: 12, width: 420, height: 666 } as Rect;
        toolSelectionCollisionServiceSpyObj.getElementListBounds.and.returnValue(selectionRect);
        const expectedPositions = [
            { x: selectionRect.x, y: selectionRect.y + selectionRect.height / 2 } as Vec2,
            { x: selectionRect.x + selectionRect.width / 2, y: selectionRect.y } as Vec2,
            { x: selectionRect.x + selectionRect.width, y: selectionRect.y + selectionRect.height / 2 } as Vec2,
            { x: selectionRect.x + selectionRect.width / 2, y: selectionRect.y + selectionRect.height } as Vec2,
        ];

        service.updateSvgSelectedShapesRect({} as SVGGraphicsElement[]);

        for (let i = 0; i < expectedPositions.length; i++) {
            const controlPointHalfSideSize = 5;
            expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(
                service['svgControlPoints'][i],
                'x',
                `${expectedPositions[i].x - controlPointHalfSideSize}`
            );
            expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(
                service['svgControlPoints'][i],
                'y',
                `${expectedPositions[i].y - controlPointHalfSideSize}`
            );
        }
    });

    it('#showSvgSelectedShapesRect should do nothing if selection is already being displayed', () => {
        service['isSelectionDisplayed'] = true;
        service['showSvgSelectedShapesRect']();
        expect(drawingServiceSpyObj.addUiElement).not.toHaveBeenCalled();
    });

    it('#showSvgSelectedShapesRect should add the rect to the UI if selection is not already being displayed', () => {
        service['isSelectionDisplayed'] = false;
        service['showSvgSelectedShapesRect']();
        expect(drawingServiceSpyObj.addUiElement).toHaveBeenCalled();
    });

    it('#hideSvgSelectedShapesRect should do nothing if selection is not being displayed', () => {
        service['isSelectionDisplayed'] = false;
        service['hideSvgSelectedShapesRect']();
        expect(drawingServiceSpyObj.removeUiElement).not.toHaveBeenCalled();
    });

    it('#hideSvgSelectedShapesRect should remove the rect to the UI if selection being displayed', () => {
        service['isSelectionDisplayed'] = true;
        service['hideSvgSelectedShapesRect']();
        expect(drawingServiceSpyObj.removeUiElement).toHaveBeenCalled();
    });

    it('#createDashedRectBorder should create a svg rect element and set its color according to the one passed by parameter', () => {
        const colorValue = 10;
        const colorStub = { red: colorValue, green: colorValue, blue: colorValue } as Color;
        const svgRectStub = {} as SVGRectElement;
        renderer2SpyObj.createElement.and.returnValue(svgRectStub);

        service['createDashedRectBorder'](colorStub);

        expect(renderer2SpyObj.createElement).toHaveBeenCalledWith('rect', 'svg');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(
            svgRectStub,
            'fill',
            `rgba(${colorValue}, ${colorValue}, ${colorValue}, 0.2)`
        );
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'stroke-dasharray', '5, 3');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'stroke-width', '2');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'stroke-linecap', 'round');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(
            svgRectStub,
            'stroke',
            `rgba(${colorValue}, ${colorValue}, ${colorValue}, 0.8)`
        );
    });

    it("#updateSvgRectFromRect should use renderer2 to set the svgRect's attributes", () => {
        const svgRectStub = {} as SVGRectElement;
        const rect: Rect = { x: 10, y: 10, width: 10, height: 10 };

        service.updateSvgRectFromRect(svgRectStub, rect);

        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'x', rect.x.toString());
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'y', rect.y.toString());
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'width', rect.width.toString());
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'height', rect.height.toString());
    });
});

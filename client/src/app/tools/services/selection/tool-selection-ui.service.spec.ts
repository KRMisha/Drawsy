import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionUiService } from '@app/tools/services/selection/tool-selection-ui.service';
import { Subject } from 'rxjs';

// tslint:disable: no-any
// tslint:disable: no-string-literal

describe('ToolSelectionUiService', () => {
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let toolSelectionCollisionServiceSpyObj: jasmine.SpyObj<ToolSelectionCollisionService>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let toolSelectionStateServiceSpyObj: jasmine.SpyObj<ToolSelectionStateService>;

    let selectedElementsRectChangedSubject: Subject<SVGGraphicsElement[]>;

    let service: ToolSelectionUiService;

    const controlPointsCount = 4;

    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement', 'appendChild']);
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        toolSelectionCollisionServiceSpyObj = jasmine.createSpyObj('ToolSelectionCollisionService', ['getElementListBounds']);

        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['addUiElement', 'removeUiElement']);

        selectedElementsRectChangedSubject = new Subject<SVGGraphicsElement[]>();
        toolSelectionStateServiceSpyObj = jasmine.createSpyObj('ToolSelectionStateService', ['updateSelectionRect'], {
            selectedElementsRectChanged$: selectedElementsRectChangedSubject,
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
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#constructor should set correct attributes to the 4 control points', () => {
        for (let i = 0; i < controlPointsCount; i++) {
            const controlPointSideSize = '8';
            expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(service['svgControlPoints'][i], 'width', controlPointSideSize);
            expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(service['svgControlPoints'][i], 'height', controlPointSideSize);
        }
    });

    it('#selectedElementsRectChangedSubscription should update svg rect', () => {
        const setSelectedElementsRectSpy = spyOn<any>(service, 'setSelectedElementsRect');
        selectedElementsRectChangedSubject.next([{} as SVGGraphicsElement]);
        expect(setSelectedElementsRectSpy).toHaveBeenCalled();
    });

    it('#ngOnDestroy should unsubscribe from selectedElementsRectChanged event', () => {
        const unsubscribeSpy = spyOn<any>(service['selectedElementsRectChangedSubscription'], 'unsubscribe');
        service.ngOnDestroy();
        expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('#setSelectedElementsRect should hide selected shapes rect if the elements bounds is undefined', () => {
        service['isSelectedElementsRectDisplayed'] = true;
        service['setSelectedElementsRect'](undefined);
        expect(drawingServiceSpyObj.removeUiElement).toHaveBeenCalledWith(service['svgSelectedElementsRectGroup']);
    });

    it('#setSelectedElementsRect should change the position of the box around selected elements', () => {
        const selectionRect = { x: 69, y: 12, width: 420, height: 666 } as Rect;
        toolSelectionCollisionServiceSpyObj.getElementListBounds.and.returnValue(selectionRect);
        const expectedPositions = [
            { x: selectionRect.x, y: selectionRect.y + selectionRect.height / 2 } as Vec2,
            { x: selectionRect.x + selectionRect.width / 2, y: selectionRect.y } as Vec2,
            { x: selectionRect.x + selectionRect.width, y: selectionRect.y + selectionRect.height / 2 } as Vec2,
            { x: selectionRect.x + selectionRect.width / 2, y: selectionRect.y + selectionRect.height } as Vec2,
        ];

        service['setSelectedElementsRect'](selectionRect);

        for (let i = 0; i < expectedPositions.length; i++) {
            const controlPointHalfSideSize = 4;
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

    it('#showSelectedElementsRect should do nothing if selection is already being displayed', () => {
        service['isSelectedElementsRectDisplayed'] = true;
        service['showSelectedElementsRect']();
        expect(drawingServiceSpyObj.addUiElement).not.toHaveBeenCalled();
    });

    it('#showSelectedElementsRect should add the rect to the UI if selection is not already being displayed', () => {
        service['isSelectedElementsRectDisplayed'] = false;
        service['showSelectedElementsRect']();
        expect(drawingServiceSpyObj.addUiElement).toHaveBeenCalled();
    });

    it('#hideSelectedElementsRect should do nothing if selection is not being displayed', () => {
        service['isSelectedElementsRectDisplayed'] = false;
        service['hideSelectedElementsRect']();
        expect(drawingServiceSpyObj.removeUiElement).not.toHaveBeenCalled();
    });

    it('#hideSelectedElementsRect should remove the rect to the UI if selection being displayed', () => {
        service['isSelectedElementsRectDisplayed'] = true;
        service['hideSelectedElementsRect']();
        expect(drawingServiceSpyObj.removeUiElement).toHaveBeenCalled();
    });

    it('#createUiElements should create a svg rect element and set its color according to the one passed by parameter', () => {
        const svgRectStub = {} as SVGRectElement;
        renderer2SpyObj.createElement.and.returnValue(svgRectStub);

        service['createUiElements']();

        expect(renderer2SpyObj.createElement).toHaveBeenCalledWith('rect', 'svg');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'stroke-dasharray', '5, 3');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'stroke-width', '1.5');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'stroke-linecap', 'round');
    });

    it("#updateSvgRectFromRect should use renderer2 to set the svgRect's attributes", () => {
        const svgRectStub = {} as SVGRectElement;
        const rect: Rect = { x: 10, y: 10, width: 10, height: 10 };

        service['updateSvgRectFromRect'](svgRectStub, rect);

        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'x', rect.x.toString());
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'y', rect.y.toString());
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'width', rect.width.toString());
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'height', rect.height.toString());
    });
});

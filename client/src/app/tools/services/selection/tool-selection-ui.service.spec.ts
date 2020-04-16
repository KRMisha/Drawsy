import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { SelectionState } from '@app/tools/enums/selection-state.enum';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionUiService } from '@app/tools/services/selection/tool-selection-ui.service';
import { Subject } from 'rxjs';

// tslint:disable: no-any
// tslint:disable: no-string-literal

describe('ToolSelectionUiService', () => {
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let rendererFactory2SpyObj: jasmine.SpyObj<RendererFactory2>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let toolSelectionStateServiceSpyObj: jasmine.SpyObj<ToolSelectionStateService>;

    let selectedElementsRectChangedSubject: Subject<SVGGraphicsElement[]>;

    let service: ToolSelectionUiService;

    const drawingRootMock = {} as SVGSVGElement;
    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', [
            'setAttribute',
            'createElement',
            'appendChild',
            'addClass',
            'setStyle',
            'removeStyle',
        ]);
        rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['addUiElement', 'removeUiElement'], {
            drawingRoot: drawingRootMock,
        });

        selectedElementsRectChangedSubject = new Subject<SVGGraphicsElement[]>();
        toolSelectionStateServiceSpyObj = jasmine.createSpyObj('ToolSelectionStateService', ['updateSelectionRect'], {
            selectedElementsRectChanged$: selectedElementsRectChangedSubject,
        });

        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ToolSelectionStateService, useValue: toolSelectionStateServiceSpyObj },
            ],
        });
        service = TestBed.inject(ToolSelectionUiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("#constructor should instanciate the renderer, subscribe to toolSelectionStateService's selectedElementsRectChanged and call #createUiElements", () => {
        const subscribeSpy = spyOn(selectedElementsRectChangedSubject, 'subscribe');
        const createUiElementsSpy = spyOn<any>(ToolSelectionUiService.prototype, 'createUiElements');
        service = new ToolSelectionUiService(rendererFactory2SpyObj, drawingServiceSpyObj, toolSelectionStateServiceSpyObj);
        expect(service['renderer']).not.toBeUndefined();
        expect(subscribeSpy).toHaveBeenCalled();
        expect(createUiElementsSpy).toHaveBeenCalled();
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

    it('#setUserSelectionRect should call #updateSvgRectFromRect', () => {
        const rect = {} as Rect;
        const svgRectElementMock = {} as SVGRectElement;
        service['svgUserSelectionRect'] = svgRectElementMock;
        const updateSvgRectFromRectSpy = spyOn<any>(service, 'updateSvgRectFromRect');
        service.setUserSelectionRect(rect);
        expect(updateSvgRectFromRectSpy).toHaveBeenCalledWith(svgRectElementMock, rect);
    });

    it("#showUserSelectionRect should call drawingService's addUiElement", () => {
        const svgRectElementMock = {} as SVGRectElement;
        service['svgUserSelectionRect'] = svgRectElementMock;
        service.showUserSelectionRect();
        expect(drawingServiceSpyObj.addUiElement).toHaveBeenCalledWith(svgRectElementMock);
    });

    it("#hideUserSelectionRect should call drawingService's removeUiElement", () => {
        const svgRectElementMock = {} as SVGRectElement;
        service['svgUserSelectionRect'] = svgRectElementMock;
        service.hideUserSelectionRect();
        expect(drawingServiceSpyObj.removeUiElement).toHaveBeenCalledWith(svgRectElementMock);
    });

    it('#setSelectedElementsRect should hide selected shapes rect if the elements bounds is undefined', () => {
        service['isSelectedElementsRectDisplayed'] = true;
        service['setSelectedElementsRect'](undefined);
        expect(drawingServiceSpyObj.removeUiElement).toHaveBeenCalledWith(service['svgSelectedElementsRectGroup']);
    });

    it("#updateUserSelectionRectCursor should call renderer's setStyle if the selection is moving with the mouse", () => {
        const state = SelectionState.MovingSelectionWithMouse;
        service.updateUserSelectionRectCursor(state);
        expect(renderer2SpyObj.setStyle).toHaveBeenCalledWith(drawingRootMock, 'cursor', 'move');
    });

    it('#updateUserSelectionRectCursor should call #resetUserSelectionRectCursor if the selection is not being moved by the mouse', () => {
        const resetUserSelectionRectCursorSpy = spyOn(service, 'resetUserSelectionRectCursor');
        const state = SelectionState.ChangingSelection;
        service.updateUserSelectionRectCursor(state);
        expect(resetUserSelectionRectCursorSpy).toHaveBeenCalled();
    });

    it("#resetUserSelectionRectCursor should call renderer's removeStyle", () => {
        service.resetUserSelectionRectCursor();
        expect(renderer2SpyObj.removeStyle).toHaveBeenCalledWith(drawingRootMock, 'cursor');
    });

    it('#createUiElements should create a svg rect element and set its color according to the one passed by parameter', () => {
        const svgRectStub = {} as SVGRectElement;
        renderer2SpyObj.createElement.and.returnValue(svgRectStub);

        service['createUiElements']();

        expect(renderer2SpyObj.createElement).toHaveBeenCalledWith('rect', 'svg');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'stroke-dasharray', '5, 3');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'stroke-width', '1.5');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'stroke-linecap', 'round');
        expect(renderer2SpyObj.addClass).toHaveBeenCalledWith(svgRectStub, 'theme-selected-elements-rect');
    });

    it('#setSelectedElementsRect should hide selected shapes rect if the elements bounds is undefined', () => {
        service['isSelectedElementsRectDisplayed'] = true;
        service['setSelectedElementsRect'](undefined);
        expect(drawingServiceSpyObj.removeUiElement).toHaveBeenCalledWith(service['svgSelectedElementsRectGroup']);
    });

    it("#setSelectedElementsRect should update the selection rect and show the selectedElements' rect", () => {
        const updateSvgRectFromRectSpy = spyOn<any>(service, 'updateSvgRectFromRect');
        const showSelectedElementsRectSpy = spyOn<any>(service, 'showSelectedElementsRect');

        const svgSelectedElementRectMock = {} as SVGRectElement;
        service['svgSelectedElementsRect'] = svgSelectedElementRectMock;

        const selectionRect = { x: 0, y: 0, width: 4, height: 4 } as Rect;
        const expectedPositions = [
            { x: selectionRect.x, y: selectionRect.y + selectionRect.height / 2 } as Vec2,
            { x: selectionRect.x + selectionRect.width / 2, y: selectionRect.y } as Vec2,
            { x: selectionRect.x + selectionRect.width, y: selectionRect.y + selectionRect.height / 2 } as Vec2,
            { x: selectionRect.x + selectionRect.width / 2, y: selectionRect.y + selectionRect.height } as Vec2,
        ];

        service['setSelectedElementsRect'](selectionRect);

        for (let i = 0; i < expectedPositions.length; i++) {
            expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(service['svgControlPoints'][i], 'cx', `${expectedPositions[i].x}`);
            expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(service['svgControlPoints'][i], 'cy', `${expectedPositions[i].y}`);
        }

        expect(updateSvgRectFromRectSpy).toHaveBeenCalledWith(svgSelectedElementRectMock, selectionRect);
        expect(showSelectedElementsRectSpy).toHaveBeenCalled();
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

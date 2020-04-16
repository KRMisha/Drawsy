import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Rect } from '@app/shared/classes/rect';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionUiService } from '@app/tools/services/selection/tool-selection-ui.service';
import { Subject } from 'rxjs';

// tslint:disable: no-any
// tslint:disable: no-string-literal

describe('ToolSelectionUiService', () => {
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let rendererFactory2SpyObj: jasmine.SpyObj<RendererFactory2>;
    let toolSelectionCollisionServiceSpyObj: jasmine.SpyObj<ToolSelectionCollisionService>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let toolSelectionStateServiceSpyObj: jasmine.SpyObj<ToolSelectionStateService>;

    let selectedElementsRectChangedSubject: Subject<SVGGraphicsElement[]>;

    let service: ToolSelectionUiService;

    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement', 'appendChild', 'addClass']);
        rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
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

    it('#setUserSelectionRect should hide selected shapes rect if the elements bounds is undefined', () => {
        const selectionRectStub = {} as SVGRectElement;
        const rectStub = {} as Rect;
        const updateSvgRectFromRectSpy = spyOn<any>(service, 'updateSvgRectFromRect');
        service['svgUserSelectionRect'] = selectionRectStub;
        service.setUserSelectionRect(rectStub);
        expect(updateSvgRectFromRectSpy).toHaveBeenCalledWith(selectionRectStub, rectStub);
    });

    // it('#setSelectedElementsRect should change the position of the box around selected elements', () => {
    //     const selectionRect = { x: 69, y: 12, width: 420, height: 666 } as Rect;
    //     toolSelectionCollisionServiceSpyObj.getElementListBounds.and.returnValue(selectionRect);
    //     const expectedPositions = [
    //         { x: selectionRect.x, y: selectionRect.y + selectionRect.height / 2 } as Vec2,
    //         { x: selectionRect.x + selectionRect.width / 2, y: selectionRect.y } as Vec2,
    //         { x: selectionRect.x + selectionRect.width, y: selectionRect.y + selectionRect.height / 2 } as Vec2,
    //         { x: selectionRect.x + selectionRect.width / 2, y: selectionRect.y + selectionRect.height } as Vec2,
    //     ];

    //     service['setSelectedElementsRect'](selectionRect);

    //     for (let i = 0; i < expectedPositions.length; i++) {
    //         expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(service['svgControlPoints'][i], 'cx', `${expectedPositions[i].x}`);
    //         expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(service['svgControlPoints'][i], 'cy', `${expectedPositions[i].y}`);
    //     }
    // });

    it('#showUserSelectionRect should do nothing if selection is already being displayed', () => {
        const selectionRectStub = {} as SVGRectElement;
        service['svgUserSelectionRect'] = selectionRectStub;
        service.showUserSelectionRect();
        expect(drawingServiceSpyObj.addUiElement).toHaveBeenCalledWith(selectionRectStub);
    });

    it('#hideSelectedElementsRect should remove the rect to the UI if selection being displayed', () => {
        const selectionRectStub = {} as SVGRectElement;
        service['svgUserSelectionRect'] = selectionRectStub;
        service.hideUserSelectionRect();
        expect(drawingServiceSpyObj.removeUiElement).toHaveBeenCalledWith(selectionRectStub);
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

import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RemoveElementsCommand } from '@app/drawing/classes/commands/remove-elements-command';
import { ElementSiblingPair } from '@app/drawing/classes/element-sibling-pair';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { ToolEraserService } from '@app/tools/services/tool-eraser.service';

// tslint:disable: no-any
// tslint:disable: no-string-literal

fdescribe('ToolEraserService', () => {
    let service: ToolEraserService;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let commandServiceSpyObj: jasmine.SpyObj<CommandService>;

    const sVGGraphicsElementStub = {} as SVGGraphicsElement;
    const svgElementsInitialArray = [sVGGraphicsElementStub, sVGGraphicsElementStub, sVGGraphicsElementStub];
    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement']);
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['removeElement', 'addUiElement', 'removeUiElement'], {
            svgElements: svgElementsInitialArray,
        });

        commandServiceSpyObj = jasmine.createSpyObj('CommandService', ['addCommand']);
        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: CommandService, useValue: commandServiceSpyObj },
            ],
        });
        service = TestBed.inject(ToolEraserService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onMouseMove should only call #updateEraserRect if the timerId is not undefined', () => {
        const updateEraserRectSpy = spyOn<any>(service, 'updateEraserRect');
        const setTimeoutSpy = spyOn<any>(window, 'setTimeout');
        service['timerId'] = 0;
        service.onMouseMove();

        expect(updateEraserRectSpy).toHaveBeenCalled();
        expect(setTimeoutSpy).not.toHaveBeenCalled();
    });

    it('#onMouseMove should call #update after an interval when the timerId undefined', () => {
        jasmine.clock().install();
        const updateEraserRectSpy = spyOn<any>(service, 'updateEraserRect');
        const updateSpy = spyOn(service, 'update');

        service.onMouseMove();
        expect(updateEraserRectSpy).toHaveBeenCalled();

        expect(updateSpy).not.toHaveBeenCalled();
        const msDelayBetweenCalls = 16;
        jasmine.clock().tick(msDelayBetweenCalls);
        expect(updateSpy).toHaveBeenCalled();

        jasmine.clock().uninstall();
    });

    // it("#onMouseDown should make a copy of the drawingService's svgElements and call #update", () => {
    //     const updateSpy = spyOn(service, 'update');
    //     service.onMouseDown({} as MouseEvent);
    //     expect(service['drawingElementsCopy']).toEqual(svgElementsInitialArray);
    //     expect(updateSpy).toHaveBeenCalled();
    // });

    it('#onMouseUp should return early if there were no elements deleted during the drag', () => {
        service['svgElementsDeletedDuringDrag'] = [];
        expect(commandServiceSpyObj.addCommand).not.toHaveBeenCalled();
    });

    it('#onMouseUp should add a removeElementCommand with the elements in the right order using the commandService', () => {
        const svgElementStub1 = {} as SVGGraphicsElement;
        const svgElementStub2 = {} as SVGGraphicsElement;
        const svgElementStub3 = {} as SVGGraphicsElement;

        service['drawingElementsCopy'] = [svgElementStub1, svgElementStub2, svgElementStub3];

        const firstSiblingPair = { element: svgElementStub1, sibling: svgElementStub2 } as ElementSiblingPair;
        const secondSiblingPair = { element: svgElementStub2, sibling: svgElementStub3 } as ElementSiblingPair;

        service['svgElementsDeletedDuringDrag'] = [firstSiblingPair, secondSiblingPair];
        const expectedCommandElements = [secondSiblingPair, firstSiblingPair];
        service.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(commandServiceSpyObj.addCommand).toHaveBeenCalledWith(
            new RemoveElementsCommand(drawingServiceSpyObj, expectedCommandElements)
        );
    });

    it('#onEnter should call #updateEraserRect', () => {
        const updateEraserRectSpy = spyOn<any>(service, 'updateEraserRect');
        service.onEnter({} as MouseEvent);
        expect(updateEraserRectSpy).toHaveBeenCalled();
    });

    // TESTS DE UPDATE LIKE WTFFFFFFFFFADSFAS EFB SDRFGSDFGV BSD ASE

    it("#onToolSelection should create the eraser's rect, add it to the ui elements of drawingService and call #updateEraserRect", () => {
        const updateEraserRectSpy = spyOn<any>(service, 'updateEraserRect');
        const svgEraserElementStub = {} as SVGRectElement;
        renderer2SpyObj.createElement.and.returnValue(svgEraserElementStub);

        service.onToolSelection();

        expect(renderer2SpyObj.createElement).toHaveBeenCalledWith('rect', 'svg');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgEraserElementStub, 'fill', '#fafafa');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgEraserElementStub, 'stroke', '#424242');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgEraserElementStub, 'stroke-width', '1');
        expect(drawingServiceSpyObj.addUiElement).toHaveBeenCalledWith(svgEraserElementStub);
        expect(updateEraserRectSpy);
    });

    it('#onToolDeselection should remove the ');
});

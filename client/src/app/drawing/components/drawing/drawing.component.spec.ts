import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';
import { DrawingComponent } from '@app/drawing/components/drawing/drawing.component';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';
import { ToolSelectorService } from '@app/tools/services/tool-selector.service';

// tslint:disable: max-classes-per-file
// tslint:disable: no-empty
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

class MockColor extends Color {
    toRgbaString = () => 'rgba(69, 69, 69, 1)';
}

class MockDrawingService extends DrawingService {
    renderer: Renderer2;
    rootElement: SVGElement;
    drawingDimensions: Vec2;
    backgroundColor = new MockColor();
    reappendStoredElements = () => {};
}

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let drawingServiceMock: MockDrawingService;
    let toolSelectorServiceSpyObj: jasmine.SpyObj<ToolSelectorService>;

    beforeEach(async(() => {
        drawingServiceMock = new MockDrawingService();
        toolSelectorServiceSpyObj = jasmine.createSpyObj('ToolSelectorService', [
            'setRenderer',
            'onMouseMove',
            'onMouseDown',
            'onMouseUp',
            'onMouseDoubleClick',
            'onKeyDown',
            'onKeyUp',
            'onEnter',
            'onLeave',
            'setMouseDown',
            'setMouseInside',
        ]);

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: Renderer2, useValue: {} as Renderer2 },
                { provide: DrawingService, useValue: drawingServiceMock },
                { provide: ToolSelectorService, useValue: toolSelectorServiceSpyObj },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("#ngOnInit should set DrawingService and ToolSelectorService's renderers", () => {
        delete drawingServiceMock.renderer;
        component['renderer'] = {} as Renderer2;
        component.ngOnInit();
        expect(drawingServiceMock.renderer).toEqual({} as Renderer2);
        expect(toolSelectorServiceSpyObj.setRenderer).toHaveBeenCalledWith({} as Renderer2);
    });

    it("#ngAfterViewInit should set DrawingService's rootElement and call reappendStoredElements", () => {
        delete drawingServiceMock.rootElement;
        spyOn(drawingServiceMock, 'reappendStoredElements').and.callThrough();

        component.ngAfterViewInit();
        // expect(drawingServiceMock.rootElement).toBe(component['svg'].nativeElement);
        expect(drawingServiceMock.reappendStoredElements).toHaveBeenCalled();
    });

    it('should forward HostListener events to the appropriate ToolSelectorService methods', () => {
        component.onMouseMove({} as MouseEvent);
        expect(toolSelectorServiceSpyObj.onMouseMove).toHaveBeenCalled();

        component.onMouseDown({} as MouseEvent);
        expect(toolSelectorServiceSpyObj.onMouseDown).toHaveBeenCalled();

        component.onMouseUp({} as MouseEvent);
        expect(toolSelectorServiceSpyObj.onMouseUp).toHaveBeenCalled();

        component.onMouseDoubleClick({} as MouseEvent);
        expect(toolSelectorServiceSpyObj.onMouseDoubleClick).toHaveBeenCalled();

        component.onKeyDown({} as KeyboardEvent);
        expect(toolSelectorServiceSpyObj.onKeyDown).toHaveBeenCalled();

        component.onKeyUp({} as KeyboardEvent);
        expect(toolSelectorServiceSpyObj.onKeyUp).toHaveBeenCalled();

        component.onEnter({} as MouseEvent);
        expect(toolSelectorServiceSpyObj.onEnter).toHaveBeenCalled();

        component.onLeave({} as MouseEvent);
        expect(toolSelectorServiceSpyObj.onLeave).toHaveBeenCalled();
    });

    it('#onMouseDown should call ToolSelectorService.setMouseDown with true if event button is a left click', () => {
        component.onMouseDown({ button: ButtonId.Left } as MouseEvent);
        expect(toolSelectorServiceSpyObj.setMouseDown).toHaveBeenCalledWith(true);
    });

    it('#onMouseDown should not call ToolSelectorService.setMouseDown if event button is not a left click', () => {
        component.onMouseDown({ button: ButtonId.Right } as MouseEvent);
        expect(toolSelectorServiceSpyObj.setMouseDown).not.toHaveBeenCalled();
    });

    it('#onMouseUp should call ToolSelectorService.setMouseDown with false if event button is a left click', () => {
        component.onMouseUp({ button: ButtonId.Left } as MouseEvent);
        expect(toolSelectorServiceSpyObj.setMouseDown).toHaveBeenCalledWith(false);
    });

    it('#onMouseUp should not call ToolSelectorService.setMouseDown if event button is not a left click', () => {
        component.onMouseUp({ button: ButtonId.Right } as MouseEvent);
        expect(toolSelectorServiceSpyObj.setMouseDown).not.toHaveBeenCalled();
    });

    it('#onEnter should call ToolSelectorService.setMouseInside with true', () => {
        component.onEnter({} as MouseEvent);
        expect(toolSelectorServiceSpyObj.setMouseInside).toHaveBeenCalledWith(true);
    });

    it('#onLeave should call ToolSelectorService.setMouseInside with false', () => {
        component.onLeave({} as MouseEvent);
        expect(toolSelectorServiceSpyObj.setMouseInside).toHaveBeenCalledWith(false);
    });

    it('#getWidth should return the width from DrawingService', () => {
        drawingServiceMock.drawingDimensions = { x: 1234, y: 2345 };
        expect(component.getWidth()).toEqual(1234);
    });

    it('#getHeight should return the height from DrawingService', () => {
        drawingServiceMock.drawingDimensions = { x: 1234, y: 2345 };
        expect(component.getHeight()).toEqual(2345);
    });

    it('#getBackgroundColor should return the background color from DrawingService', () => {
        expect(component.getBackgroundColor()).toEqual('rgba(69, 69, 69, 1)');
    });
});

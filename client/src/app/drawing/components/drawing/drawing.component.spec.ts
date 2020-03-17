import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';
import { DrawingComponent } from '@app/drawing/components/drawing/drawing.component';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';
import { CurrentToolService } from '@app/tools/services/current-tool.service';

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
    let currentToolServiceSpyObj: jasmine.SpyObj<CurrentToolService>;

    beforeEach(async(() => {
        drawingServiceMock = new MockDrawingService();
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [
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
                { provide: currentToolServiceSpyObj, useValue: currentToolServiceSpyObj },
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

    it("#ngAfterViewInit should set DrawingService's rootElement and call reappendStoredElements", () => {
        delete drawingServiceMock.rootElement;
        spyOn(drawingServiceMock, 'reappendStoredElements').and.callThrough();

        component.ngAfterViewInit();
        // expect(drawingServiceMock.rootElement).toBe(component['svg'].nativeElement);
        expect(drawingServiceMock.reappendStoredElements).toHaveBeenCalled();
    });

    it('should forward HostListener events to the appropriate CurrentToolService methods', () => {
        component.onMouseMove({} as MouseEvent);
        expect(currentToolServiceSpyObj.onMouseMove).toHaveBeenCalled();

        component.onMouseDown({} as MouseEvent);
        expect(currentToolServiceSpyObj.onMouseDown).toHaveBeenCalled();

        component.onMouseUp({} as MouseEvent);
        expect(currentToolServiceSpyObj.onMouseUp).toHaveBeenCalled();

        component.onMouseDoubleClick({} as MouseEvent);
        expect(currentToolServiceSpyObj.onMouseDoubleClick).toHaveBeenCalled();

        component.onKeyDown({} as KeyboardEvent);
        expect(currentToolServiceSpyObj.onKeyDown).toHaveBeenCalled();

        component.onKeyUp({} as KeyboardEvent);
        expect(currentToolServiceSpyObj.onKeyUp).toHaveBeenCalled();

        component.onEnter({} as MouseEvent);
        expect(currentToolServiceSpyObj.onEnter).toHaveBeenCalled();

        component.onLeave({} as MouseEvent);
        expect(currentToolServiceSpyObj.onLeave).toHaveBeenCalled();
    });

    it('#onMouseDown should call CurrentToolService.setMouseDown with true if event button is a left click', () => {
        component.onMouseDown({ button: ButtonId.Left } as MouseEvent);
        expect(currentToolServiceSpyObj.setMouseDown).toHaveBeenCalledWith(true);
    });

    it('#onMouseDown should not call CurrentToolService.setMouseDown if event button is not a left click', () => {
        component.onMouseDown({ button: ButtonId.Right } as MouseEvent);
        expect(currentToolServiceSpyObj.setMouseDown).not.toHaveBeenCalled();
    });

    it('#onMouseUp should call CurrentToolService.setMouseDown with false if event button is a left click', () => {
        component.onMouseUp({ button: ButtonId.Left } as MouseEvent);
        expect(currentToolServiceSpyObj.setMouseDown).toHaveBeenCalledWith(false);
    });

    it('#onMouseUp should not call CurrentToolService.setMouseDown if event button is not a left click', () => {
        component.onMouseUp({ button: ButtonId.Right } as MouseEvent);
        expect(currentToolServiceSpyObj.setMouseDown).not.toHaveBeenCalled();
    });

    it('#onEnter should call CurrentToolService.setMouseInside with true', () => {
        component.onEnter({} as MouseEvent);
        expect(currentToolServiceSpyObj.setMouseInside).toHaveBeenCalledWith(true);
    });

    it('#onLeave should call CurrentToolService.setMouseInside with false', () => {
        component.onLeave({} as MouseEvent);
        expect(currentToolServiceSpyObj.setMouseInside).toHaveBeenCalledWith(false);
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingComponent } from '@app/drawing/components/drawing/drawing.component';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GridService } from '@app/drawing/services/grid.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { CurrentToolService } from '@app/tools/services/current-tool.service';

class ColorMock {
    toRgbaString = () => 'rgba(69, 69, 69, 1)';
}

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let currentToolServiceSpyObj: jasmine.SpyObj<CurrentToolService>;
    let gridServiceSpyObj: jasmine.SpyObj<GridService>;
    let colorSpyObj: jasmine.SpyObj<Color>;
    const returnedDimensions: Vec2 = { x: 10, y: 10 };
    beforeEach(async(() => {
        colorSpyObj = jasmine.createSpyObj('Color', ['toRgbaString']);
        colorSpyObj.toRgbaString.and.returnValue('rgba(1, 1, 1, 1)');
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['reappendStoredElements'], {
            dimensions: returnedDimensions,
            backgroundColor: colorSpyObj,
        });
        drawingServiceSpyObj.backgroundColor = new ColorMock() as Color;

        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [
            'afterDrawingInit',
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
            'setMouseInsideDrawing',
        ]);

        gridServiceSpyObj = jasmine.createSpyObj('GridService', [], {
            isDisplayEnabled: true,
            size: 10,
            opacity: 1,
        });

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: CurrentToolService, useValue: currentToolServiceSpyObj },
                { provide: GridService, useValue: gridServiceSpyObj },
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

    // it("#ngAfterViewInit should set DrawingService's rootElement and call reappendStoredElements", () => {
    //     delete drawingServiceSpyObj.drawingRoot;
    //     spyOn(drawingServiceSpyObj, 'reappendStoredElements').and.callThrough();

    //     component.ngAfterViewInit();
    //     // expect(drawingServiceMock.drawingRoot).toBe(component['svg'].nativeElement);
    //     expect(drawingServiceSpyObj.reappendStoredElements).toHaveBeenCalled();
    // });

    // it('should forward HostListener events to the appropriate CurrentToolService methods', () => {
    //     component.onMouseMove({} as MouseEvent);
    //     expect(currentToolServiceSpyObj.onMouseMove).toHaveBeenCalled();

    //     component.onMouseDown({} as MouseEvent);
    //     expect(currentToolServiceSpyObj.onMouseDown).toHaveBeenCalled();

    //     component.onMouseUp({} as MouseEvent);
    //     expect(currentToolServiceSpyObj.onMouseUp).toHaveBeenCalled();

    //     component.onMouseDoubleClick({} as MouseEvent);
    //     expect(currentToolServiceSpyObj.onMouseDoubleClick).toHaveBeenCalled();

    //     component.onKeyDown({} as KeyboardEvent);
    //     expect(currentToolServiceSpyObj.onKeyDown).toHaveBeenCalled();

    //     component.onKeyUp({} as KeyboardEvent);
    //     expect(currentToolServiceSpyObj.onKeyUp).toHaveBeenCalled();

    //     component.onEnter({} as MouseEvent);
    //     expect(currentToolServiceSpyObj.onEnter).toHaveBeenCalled();

    //     component.onLeave({} as MouseEvent);
    //     expect(currentToolServiceSpyObj.onLeave).toHaveBeenCalled();
    // });

    // it('#onMouseDown should call CurrentToolService.setMouseDown with true if event button is a left click', () => {
    //     component.onMouseDown({ button: MouseButton.Left } as MouseEvent);
    //     expect(currentToolServiceSpyObj.setLeftMouseButtonDown).toHaveBeenCalledWith(true);
    // });

    // it('#onMouseDown should not call CurrentToolService.setMouseDown if event button is not a left click', () => {
    //     component.onMouseDown({ button: MouseButton.Right } as MouseEvent);
    //     expect(currentToolServiceSpyObj.setLeftMouseButtonDown).not.toHaveBeenCalled();
    // });

    // it('#onMouseUp should call CurrentToolService.setMouseDown with false if event button is a left click', () => {
    //     component.onMouseUp({ button: MouseButton.Left } as MouseEvent);
    //     expect(currentToolServiceSpyObj.setLeftMouseButtonDown).toHaveBeenCalledWith(false);
    // });

    // it('#onMouseUp should not call CurrentToolService.setMouseDown if event button is not a left click', () => {
    //     component.onMouseUp({ button: MouseButton.Right } as MouseEvent);
    //     expect(currentToolServiceSpyObj.setLeftMouseButtonDown).not.toHaveBeenCalled();
    // });

    // it('#onEnter should call CurrentToolService.setMouseInside with true', () => {
    //     component.onEnter({} as MouseEvent);
    //     expect(currentToolServiceSpyObj.setMouseInsideDrawing).toHaveBeenCalledWith(true);
    // });

    // it('#onLeave should call CurrentToolService.setMouseInside with false', () => {
    //     component.onLeave({} as MouseEvent);
    //     expect(currentToolServiceSpyObj.setMouseInsideDrawing).toHaveBeenCalledWith(false);
    // });

    // it('#getWidth should return the width from DrawingService', () => {
    //     drawingServiceSpyObj.dimensions = { x: 1234, y: 2345 };
    //     expect(component.width).toEqual(1234);
    // });

    // it('#getHeight should return the height from DrawingService', () => {
    //     drawingServiceSpyObj.dimensions = { x: 1234, y: 2345 };
    //     expect(component.height).toEqual(2345);
    // });

    // it('#getBackgroundColor should return the background color from DrawingService', () => {
    //     expect(component.backgroundColor).toEqual('rgba(69, 69, 69, 1)');
    // });
});

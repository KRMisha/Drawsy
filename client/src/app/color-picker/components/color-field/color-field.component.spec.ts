import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorFieldComponent } from '@app/color-picker/components/color-field/color-field.component';
import { Vec2 } from '@app/shared/classes/vec2';
// import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
// import { Observable } from 'rxjs';
// import { Color } from '@app/classes/color';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

class CanvasMock {
    height = 10;
    width = 10;

    getContext(): CanvasRenderingContext2D {
        return {} as CanvasRenderingContext2D;
    }

    getBoundingClientRect(): Vec2 {
        return { x: 4, y: 4 } as Vec2;
    }
}

// tslint:disable-next-line: max-classes-per-file
// class ColorPickerServiceMock {
//     value = 10;
//     saturation = 10;
//     hue = 10;
//     hueChanged$ = new Observable<number>();
//     saturationChanged$ = new Observable<number>();
//     valueChanged$ = new Observable<number>();
//     getColor(): Color {
//         return {red: 10, green: 10, blue: 10, alpha: 1} as Color
//     }
// }

describe('ColorFieldComponent', () => {
    let component: ColorFieldComponent;
    let fixture: ComponentFixture<ColorFieldComponent>;
    let canvasMock: CanvasMock;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorFieldComponent],
            // providers: [
            //     {provide: ColorPickerService, useValue: }
            // ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.onMouseEnter();
        canvasMock = new CanvasMock();
        spyOn(component.saturationValueCanvas, 'nativeElement').and.returnValue(canvasMock);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('#ngAfterViewInit should initialise the canvas and its dimensions (250 by 160)', () => {
    //     component.ngAfterViewInit();
    //     const componentCanvas = component['canvas'];
    //     expect(componentCanvas).toBe(canvasMock);
    //     expect(componentCanvas.width).toBe(250);
    //     expect(componentCanvas.height).toBe(160);
    // });

    // it('#ngAfterViewInit should initialise the context', () => {
    //     component.ngAfterViewInit();
    //     expect(component['canvas']).toBe(canvasMock.getContext());
    // });

    // it('#ngAfterViewInit should initialise slider position', () => {
    //     component.ngAfterViewInit();
    //     const componentCanvas = component['canvas'];
    //     expect(componentCanvas).toBe(canvasMock.getContext());

    //     // const expectedY =
    // });

    // it('#set hue should redraw the canvas if it is not undefined', () => {
    //     component.hue = 12;
    //     expect(component.draw).toHaveBeenCalled();
    // });

    // it('#set hue should not redraw the canvas if it is undefined', () => {
    //     delete component['canvas'];
    //     component.hue = 12;
    //     expect(component.draw).not.toHaveBeenCalled();
    // });

    // it('#set saturation should redraw the canvas if it is not undefined', () => {
    //     component.saturation = 12;
    //     expect(component.draw).toHaveBeenCalled();
    // });

    // it('#set saturation should not redraw the canvas if it is undefined', () => {
    //     delete component['canvas'];
    //     component.saturation = 12;
    //     expect(component.draw).not.toHaveBeenCalled();
    // });

    // it('#set value should redraw the canvas if it is not undefined', () => {
    //     component.value = 12;
    //     expect(component.draw).toHaveBeenCalled();
    // });

    // it('#set value should not redraw the canvas if it is undefined', () => {
    //     delete component['canvas'];
    //     component.value = 12;
    //     expect(component.draw).not.toHaveBeenCalled();
    // });

    // it('#onMouseDown should call updateColor if mouse is inside', () => {
    //     component.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
    //     expect(component.updateColor).toHaveBeenCalled();
    // });

    // it('#onMouseDown should not call updateColor if mouse is not inside', () => {
    //     component.onMouseLeave();
    //     component.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
    //     expect(component.updateColor).not.toHaveBeenCalled();
    // });

    // it('#onMouseMove should call updateColor', () => {
    //     component.onMouseMove({ offsetX: 20, offsetY: 20 } as MouseEvent);
    //     expect(component.updateColor).toHaveBeenCalled();
    // });

    // it('#updateColor should emit saturationValueChange if the mouse is inside and the mouse is down', () => {
    //     component['isMouseDown'] = true;
    //     component.updateColor({ offsetX: 20, offsetY: 20 } as MouseEvent);
    //     expect(component.saturationValueChange.emit).toHaveBeenCalled();
    // });

    // it('#updateColor should not emit saturationValueChange if the mouse is not inside and the mouse is down', () => {
    //     component.onMouseLeave();
    //     component.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
    //     component.updateColor({ offsetX: 20, offsetY: 20 } as MouseEvent);
    //     expect(component.saturationValueChange.emit).not.toHaveBeenCalled();
    // });

    // it('#updateColor should not emit saturationValueChange if the mouse is inside and the mouse is not down', () => {
    //     component.onMouseUp({} as MouseEvent);
    //     component.updateColor({ offsetX: 20, offsetY: 20 } as MouseEvent);
    //     expect(component.saturationValueChange.emit).not.toHaveBeenCalled();
    // });

    // it('#updateColor should not emit saturationValueChange if the mouse is not inside and the mouse is not down', () => {
    //     component.onMouseLeave();
    //     component.updateColor({ offsetX: 20, offsetY: 20 } as MouseEvent);
    //     expect(component.saturationValueChange.emit).not.toHaveBeenCalled();
    // });
});

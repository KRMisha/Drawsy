import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorFieldComponent } from './color-field.component';

describe('ColorFieldComponent', () => {
    let component: ColorFieldComponent;
    let fixture: ComponentFixture<ColorFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorFieldComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.onMouseEnter();
        spyOn(component.saturationValueChange, 'emit');
        spyOn(component, 'draw');
        spyOn(component, 'updateColor').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#set hue should redraw the canvas if it is not undefined', () => {
        component.hue = 12;
        expect(component.draw).toHaveBeenCalledTimes(1);
    });

    it('#set hue should not redraw the canvas if it is undefined', () => {
        // tslint:disable-next-line: no-string-literal
        delete component['canvas']
        component.hue = 12;
        expect(component.draw).toHaveBeenCalledTimes(0);
    });

    it('#set saturation should redraw the canvas if it is not undefined', () => {
        component.saturation = 12;
        expect(component.draw).toHaveBeenCalledTimes(1);
    });

    it('#set saturation should not redraw the canvas if it is undefined', () => {
        // tslint:disable-next-line: no-string-literal
        delete component['canvas']
        component.saturation = 12;
        expect(component.draw).toHaveBeenCalledTimes(0);
    });

    it('#set value should redraw the canvas if it is not undefined', () => {
        component.value = 12;
        expect(component.draw).toHaveBeenCalledTimes(1);
    });

    it('#set value should not redraw the canvas if it is undefined', () => {
        // tslint:disable-next-line: no-string-literal
        delete component['canvas']
        component.value = 12;
        expect(component.draw).toHaveBeenCalledTimes(0);
    });

    it('#onMouseDown should call updateColor if mouse is inside', () => {
        component.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(component.updateColor).toHaveBeenCalledTimes(1);
    });

    it('#onMouseDown should not call updateColor if mouse is not inside', () => {
        component.onMouseLeave();
        component.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(component.updateColor).toHaveBeenCalledTimes(0);
    });

    it('#onMouseMove should call updateColor', () => {
        component.onMouseMove({ offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(component.updateColor).toHaveBeenCalledTimes(1);
    });

    it('#updateColor should emit saturationValueChange if the mouse is inside and the mouse is down', () => {
        // tslint:disable-next-line: no-string-literal
        component['isMouseDown'] = true;
        component.updateColor({ offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(component.saturationValueChange.emit).toHaveBeenCalledTimes(1);
    });

    it('#updateColor should not emit saturationValueChange if the mouse is not inside and the mouse is down', () => {
        component.onMouseLeave();
        component.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        component.updateColor({ offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(component.saturationValueChange.emit).toHaveBeenCalledTimes(0);
    });

    it('#updateColor should not emit saturationValueChange if the mouse is inside and the mouse is not down', () => {
        component.onMouseUp({} as MouseEvent);
        component.updateColor({ offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(component.saturationValueChange.emit).toHaveBeenCalledTimes(0);
    });

    it('#updateColor should not emit saturationValueChange if the mouse is not inside and the mouse is not down', () => {
        component.onMouseLeave();
        component.updateColor({ offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(component.saturationValueChange.emit).toHaveBeenCalledTimes(0);
    });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorSliderComponent } from './color-slider.component';

// tslint:disable: no-string-literal

describe('ColorSliderComponent', () => {
    let component: ColorSliderComponent;
    let fixture: ComponentFixture<ColorSliderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorSliderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        spyOn(component.hueChange, 'emit');
        component.onMouseEnter();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onMouseDown should do nothing if mouse is not inside', () => {
        component.onMouseLeave();
        component.onMouseDown({ offsetX: 50 } as MouseEvent);
        expect(component.hueChange.emit).toHaveBeenCalledTimes(0);
    });

    it('#onMouseDown should emit a hue change if mouse is inside', () => {
        component.onMouseDown({ offsetX: 50 } as MouseEvent);
        expect(component.hueChange.emit).toHaveBeenCalledTimes(1);
    });

    it("#onMouseDown shouldn't emit a hue change if mouse is inside but the mouse is not down", () => {
        component.onMouseUp();
        component.onMouseMove({ offsetX: 50 } as MouseEvent);
        expect(component.hueChange.emit).toHaveBeenCalledTimes(0);
    });

    it('#set hue should redraw the canvas', () => {
        spyOn(component, 'draw');
        component['canvas'] = {} as HTMLCanvasElement;
        component.hue = 3;
        expect(component.draw).toHaveBeenCalledTimes(1);
    });

    it('#set hue with undefined canvas should do nothing', () => {
        spyOn(component, 'draw');
        component['canvas'] = {} as HTMLCanvasElement;
        component.hue = 5;
        component['canvas'] = (undefined as unknown) as HTMLCanvasElement;
        component.hue = 6;
        expect(component.hue).toEqual(5);
    });
});

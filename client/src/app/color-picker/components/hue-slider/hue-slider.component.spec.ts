import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorSliderComponent } from './hue-slider.component';

// tslint:disable: no-magic-numbers
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
        spyOn(component.hueChange, 'emit').and.callThrough();
        component.onMouseEnter();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onMouseDown should do nothing if mouse is not inside', () => {
        component.onMouseLeave();
        component.onMouseDown({ offsetX: 50 } as MouseEvent);
        expect(component.hueChange.emit).not.toHaveBeenCalled();
    });

    it('#onMouseDown should emit a hue change if mouse is inside', () => {
        component.onMouseDown({ offsetX: 50 } as MouseEvent);
        expect(component.hueChange.emit).toHaveBeenCalled();
    });

    it("#onMouseDown shouldn't emit a hue change if mouse is inside but the mouse is not down", () => {
        component.onMouseUp();
        component.onMouseMove({ offsetX: 50 } as MouseEvent);
        expect(component.hueChange.emit).not.toHaveBeenCalled();
    });

    it('#set hue should redraw the canvas', () => {
        spyOn(component, 'draw');
        component['canvas'] = {} as HTMLCanvasElement;
        component.hue = 3;
        expect(component.draw).toHaveBeenCalled();
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

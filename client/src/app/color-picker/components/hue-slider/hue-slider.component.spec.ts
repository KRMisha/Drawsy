import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HueSliderComponent } from '@app/color-picker/components/hue-slider/hue-slider.component';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Subject } from 'rxjs';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('HueSliderComponent', () => {
    let component: HueSliderComponent;
    let fixture: ComponentFixture<HueSliderComponent>;
    let colorPickerServiceSpyObj: jasmine.SpyObj<ColorPickerService>;
    let hueChangedSubject: Subject<number>;
    beforeEach(async(() => {
        hueChangedSubject = new Subject<number>();
        colorPickerServiceSpyObj = jasmine.createSpyObj('ColorPickerService', [], {
            hue: 10,
            hueChanged$: hueChangedSubject,
        });
        TestBed.configureTestingModule({
            declarations: [HueSliderComponent],
            providers: [{ provide: ColorPickerService, useValue: colorPickerServiceSpyObj }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HueSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.onMouseEnter();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('#onMouseDown should do nothing if mouse is not inside', () => {
    //     component.onMouseLeave();
    //     component.onMouseDown({ offsetX: 50 } as MouseEvent);
    //     expect(component.hueChange.emit).not.toHaveBeenCalled();
    // });

    // it('#onMouseDown should emit a hue change if mouse is inside', () => {
    //     component.onMouseDown({ offsetX: 50 } as MouseEvent);
    //     expect(component.hueChange.emit).toHaveBeenCalled();
    // });

    // it("#onMouseDown shouldn't emit a hue change if mouse is inside but the mouse is not down", () => {
    //     component.onMouseUp();
    //     component.onMouseMove({ offsetX: 50 } as MouseEvent);
    //     expect(component.hueChange.emit).not.toHaveBeenCalled();
    // });

    // it('#set hue should redraw the canvas', () => {
    //     spyOn(component, 'draw');
    //     component['canvas'] = {} as HTMLCanvasElement;
    //     component.hue = 3;
    //     expect(component.draw).toHaveBeenCalled();
    // });

    // it('#set hue with undefined canvas should do nothing', () => {
    //     spyOn(component, 'draw');
    //     component['canvas'] = {} as HTMLCanvasElement;
    //     component.hue = 5;
    //     component['canvas'] = (undefined as unknown) as HTMLCanvasElement;
    //     component.hue = 6;
    //     expect(component.hue).toEqual(5);
    // });
});

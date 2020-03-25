import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlphaSliderComponent } from '@app/color-picker/components/alpha-slider/alpha-slider.component';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Color } from '@app/shared/classes/color';
import { Subject } from 'rxjs';

describe('AlphaSliderComponent', () => {
    let component: AlphaSliderComponent;
    let fixture: ComponentFixture<AlphaSliderComponent>;
    let colorSpyObj: jasmine.SpyObj<Color>;
    let colorPickerServiceSpyObj: jasmine.SpyObj<ColorPickerService>;
    let colorSubject: Subject<Color>;

    beforeEach(async(() => {
        colorSpyObj = jasmine.createSpyObj('Color', ['toRgbString'], {
            red: 200,
            green: 200,
            blue: 200,
            alpha: 1,
        });
        colorSpyObj.toRgbString.and.returnValue('rgb(200, 200, 200)');

        colorSubject = new Subject<Color>();
        colorPickerServiceSpyObj = jasmine.createSpyObj('ColorPickerService', ['getColor'], {
            alpha: 1,
            colorChanged$: colorSubject,
        });
        colorPickerServiceSpyObj.getColor.and.returnValue(colorSpyObj);

        TestBed.configureTestingModule({
            declarations: [AlphaSliderComponent],
            providers: [
                {provide: ColorPickerService, useValue: colorPickerServiceSpyObj},
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlphaSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

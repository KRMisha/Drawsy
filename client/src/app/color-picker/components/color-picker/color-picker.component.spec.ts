import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorPickerComponent } from '@app/color-picker/components/color-picker/color-picker.component';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { ColorService } from '@app/drawing/services/color.service';
import { Subject } from 'rxjs';

fdescribe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;
    let hueChangedSubject: Subject<number>;
    let saturationChangedSubject: Subject<number>;
    let valueChangedSubject: Subject<number>;
    let alphaChangedSubject: Subject<number>;
    let colorPickerServiceSpyObj: jasmine.SpyObj<ColorPickerService>;

    beforeEach(async(() => {
        hueChangedSubject = new Subject<number>();
        saturationChangedSubject = new Subject<number>();
        valueChangedSubject = new Subject<number>();
        alphaChangedSubject = new Subject<number>();
        colorPickerServiceSpyObj = jasmine.createSpyObj('ColorPickerService', [
            'getColor',
            'setColor',
        ], {
            hueChanged$: hueChangedSubject,
            saturationChanged$: saturationChangedSubject,
            valueChanged$: valueChangedSubject,
            alphaChanged$: alphaChangedSubject,
        });

        TestBed.configureTestingModule({
            declarations: [ColorPickerComponent],
            providers: [{ provide: ColorService, useValue: colorPickerServiceSpyObj }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { DrawingSettingsComponent } from '@app/modals/components/settings/drawing-settings/drawing-settings.component';
import { SettingsService } from '@app/modals/services/settings.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { ErrorMessageService } from '@app/shared/services/error-message.service';

// tslint:disable: no-string-literal

describe('DrawingDimensionsSettingsComponent', () => {
    let component: DrawingSettingsComponent;
    let fixture: ComponentFixture<DrawingSettingsComponent>;
    let settingServiceSpyObj: jasmine.SpyObj<SettingsService>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let formGroupStub: FormGroup;

    const initialWidth = 10;
    const initialHeight = 10;
    const backgroundColorStub = {} as Color;
    const drawingServiceDimensions: Vec2 = { x: 10, y: 10 };
    const minimumValue = 5;

    beforeEach(async(() => {
        formGroupStub = new FormGroup({
            drawingWidth: new FormControl(initialWidth, [Validators.required, Validators.min(minimumValue)]),
            drawingHeight: new FormControl(initialHeight, [Validators.required, Validators.min(minimumValue)]),
        });
        settingServiceSpyObj = jasmine.createSpyObj('SettingsService', [], {
            settingsFormGroup: formGroupStub,
        });
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], {
            backgroundColor: backgroundColorStub,
            dimensions: drawingServiceDimensions,
        });

        TestBed.configureTestingModule({
            declarations: [DrawingSettingsComponent],
            providers: [
                { provide: SettingsService, useValue: settingServiceSpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(async(() => {
        fixture = TestBed.createComponent(DrawingSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#ngOnInit should subscribe to changes on width and height values', () => {
        const widthValueChangeSpy = spyOn(formGroupStub.controls.drawingWidth.valueChanges, 'subscribe').and.callThrough();
        const heightValueChangeSpy = spyOn(formGroupStub.controls.drawingHeight.valueChanges, 'subscribe').and.callThrough();
        component.ngOnInit();

        expect(widthValueChangeSpy).toHaveBeenCalled();
        expect(heightValueChangeSpy).toHaveBeenCalled();
    });

    it("should change the drawingService's dimensions on width or height valid change", async(() => {
        const drawingServiceStub = { dimensions: drawingServiceDimensions } as DrawingService;
        component['drawingService'] = drawingServiceStub;

        const validValue = 20;
        formGroupStub.controls.drawingWidth.setValue(validValue);
        formGroupStub.controls.drawingHeight.setValue(validValue);

        expect(drawingServiceStub.dimensions.x).toEqual(validValue);
        expect(drawingServiceStub.dimensions.y).toEqual(validValue);
    }));

    it("should not change the drawingService's dimensions on width or height invalid change", async(() => {
        const drawingServiceStub = { dimensions: drawingServiceDimensions } as DrawingService;
        component['drawingService'] = drawingServiceStub;

        const invalidValue = minimumValue - 1;
        formGroupStub.controls.drawingWidth.setValue(invalidValue);
        formGroupStub.controls.drawingHeight.setValue(invalidValue);

        expect(drawingServiceStub.dimensions.x).toEqual(drawingServiceDimensions.x);
        expect(drawingServiceStub.dimensions.y).toEqual(drawingServiceDimensions.y);
    }));

    it('#ngOnDestroy should unsubscribe from width and height change subscription', () => {
        const widthSubscriptionSpy = spyOn(component['drawingWidthChangedSubscription'], 'unsubscribe');
        const heightSubscriptionSpy = spyOn(component['drawingHeightChangedSubscription'], 'unsubscribe');

        component.ngOnDestroy();

        expect(widthSubscriptionSpy).toHaveBeenCalled();
        expect(heightSubscriptionSpy).toHaveBeenCalled();
    });

    it('#getErrorMessage should forward the call to ErrorMessageService', () => {
        const errorMessageServiceSpy = spyOn(ErrorMessageService, 'getErrorMessage');
        formGroupStub = {} as FormGroup;

        component.getErrorMessage(formGroupStub);

        expect(errorMessageServiceSpy).toHaveBeenCalledWith(formGroupStub, 'Entiers');
    });

    it("set color should set the drawingService's backgroundColor", () => {
        const drawingServiceStub = { backgroundColor: backgroundColorStub } as DrawingService;
        component['drawingService'] = drawingServiceStub;

        const newBackgroundColor = {} as Color;
        component.color = newBackgroundColor;

        expect(drawingServiceStub.backgroundColor).toBe(newBackgroundColor);
    });
});

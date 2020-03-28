import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GridService } from '@app/drawing/services/grid.service';
import { GridSettingsComponent } from '@app/modals/components/settings/grid-settings/grid-settings.component';
import { SettingsService } from '@app/modals/services/settings.service';
import { ErrorMessageService } from '@app/shared/services/error-message.service';

// tslint:disable: no-string-literal

describe('GridSettingsComponent', () => {
    let component: GridSettingsComponent;
    let fixture: ComponentFixture<GridSettingsComponent>;
    let settingServiceSpyObj: jasmine.SpyObj<SettingsService>;
    let gridServiceSpyObj: jasmine.SpyObj<GridService>;
    let formGroupStub: FormGroup;

    const initialGridSize = 10;
    const gridMinimumSize = 0;
    const gridMaximumSize = 100;
    const initialGridSizeVatiation = 5;
    const initialGridOpacity = 1;
    const gridMinimumOpacity = 0;
    const gridMaximumOpacity = 1;
    const isGridDisplayEnabled = true;

    beforeEach(async(() => {
        formGroupStub = new FormGroup({
            gridSize: new FormControl(initialGridSize, [Validators.required]),
            gridOpacity: new FormControl(initialGridOpacity, [Validators.required]),
            gridDisplayEnabled: new FormControl(true, [Validators.required]),
        });
        settingServiceSpyObj = jasmine.createSpyObj('SettingsService', [], {
            settingsFormGroup: formGroupStub,
        });

        gridServiceSpyObj = jasmine.createSpyObj('GridService', [], {
            size: initialGridSize,
            minimumSize: gridMinimumSize,
            maximumSize: gridMaximumSize,
            gridSizeVariation: initialGridSizeVatiation,
            opacity: initialGridOpacity,
            minimumOpacity: gridMinimumOpacity,
            maximumOpacity: gridMaximumOpacity,
            isDisplayEnabled: isGridDisplayEnabled,
        });
        TestBed.configureTestingModule({
            declarations: [GridSettingsComponent],
            providers: [
                { provide: SettingsService, useValue: settingServiceSpyObj },
                { provide: GridService, useValue: gridServiceSpyObj },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GridSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#ngOnInit should subscribe to changes on gridDisplay, gridSize and gridOpacity changes', () => {
        const gridDisplayEnabledSpy = spyOn(formGroupStub.controls.gridDisplayEnabled.valueChanges, 'subscribe').and.callThrough();
        const gridSizeSpy = spyOn(formGroupStub.controls.gridSize.valueChanges, 'subscribe').and.callThrough();
        const gridOpacity = spyOn(formGroupStub.controls.gridOpacity.valueChanges, 'subscribe').and.callThrough();
        component.ngOnInit();

        expect(gridDisplayEnabledSpy).toHaveBeenCalled();
        expect(gridSizeSpy).toHaveBeenCalled();
        expect(gridOpacity).toHaveBeenCalled();
    });

    it("should change the gridService's gridDisplay, gridSize and gridOpacity on valid change", async(() => {
        const gridServiceStub = ({ isDisplayEnabled: true, size: 0, opacity: 0 } as unknown) as GridService;
        component['gridService'] = gridServiceStub;

        const validValue = 10;
        formGroupStub.controls.gridDisplayEnabled.setValue(false);
        formGroupStub.controls.gridSize.setValue(validValue);
        formGroupStub.controls.gridOpacity.setValue(validValue);

        expect(gridServiceStub.isDisplayEnabled).toEqual(false);
        expect(gridServiceStub.size).toEqual(validValue);
        expect(gridServiceStub.opacity).toEqual(validValue);
    }));

    it("should not change the gridService's gridDisplay, gridSize and gridOpacity on invalid change", async(() => {
        const gridServiceStub = ({ isDisplayEnabled: true, size: initialGridSize, opacity: initialGridOpacity } as unknown) as GridService;
        component['gridService'] = gridServiceStub;

        const inValidValue = '';
        formGroupStub.controls.gridDisplayEnabled.setValue(inValidValue);
        formGroupStub.controls.gridSize.setValue(inValidValue);
        formGroupStub.controls.gridOpacity.setValue(inValidValue);

        expect(gridServiceStub.isDisplayEnabled).toEqual(true);
        expect(gridServiceStub.size).toEqual(initialGridSize);
        expect(gridServiceStub.opacity).toEqual(initialGridOpacity);
    }));

    it('#ngOnDestroy should unsubscribe from gridDisplay, gridSize and gridOpacity change subscriptions', () => {
        const displayEnabledSubscriptionSpy = spyOn(component['displayEnabledSubscription'], 'unsubscribe');
        const sizeSubscriptionSpy = spyOn(component['sizeSubscription'], 'unsubscribe');
        const opacitySubscriptionSpy = spyOn(component['opacitySubscription'], 'unsubscribe');

        component.ngOnDestroy();

        expect(displayEnabledSubscriptionSpy).toHaveBeenCalled();
        expect(sizeSubscriptionSpy).toHaveBeenCalled();
        expect(opacitySubscriptionSpy).toHaveBeenCalled();
    });

    it('#getErrorMessage should forward the call the ErrorMessageService', () => {
        const errorMessageServiceSpy = spyOn(ErrorMessageService, 'getErrorMessage');
        const humanFriendlyPattern = 'This is a test';

        component.getErrorMessage(formGroupStub, humanFriendlyPattern);
        expect(errorMessageServiceSpy).toHaveBeenCalledWith(formGroupStub, humanFriendlyPattern);
    });

    it('set isGridDisplayEnabled should disabled the gridSize and gridOpacity if it is set to false', () => {
        const gridSizeSpy = spyOn(formGroupStub.controls.gridSize, 'disable');
        const gridOpacitySpy = spyOn(formGroupStub.controls.gridOpacity, 'disable');

        component.isGridDisplayEnabled = false;

        expect(gridSizeSpy).toHaveBeenCalled();
        expect(gridOpacitySpy).toHaveBeenCalled();
    });

    it('set isGridDisplayEnabled should enable the gridSize and gridOpacity if it is set to true', () => {
        const gridSizeSpy = spyOn(formGroupStub.controls.gridSize, 'enable');
        const gridOpacitySpy = spyOn(formGroupStub.controls.gridOpacity, 'enable');

        component.isGridDisplayEnabled = true;

        expect(gridSizeSpy).toHaveBeenCalled();
        expect(gridOpacitySpy).toHaveBeenCalled();
    });

    it("set gridSize should update the gridService's gridSize and set the formGroup's value", () => {
        const gridServiceStub = ({ size: initialGridSize } as unknown) as GridService;
        const setValueSpy = spyOn(formGroupStub.controls.gridSize, 'setValue');
        component['gridService'] = gridServiceStub;

        const newValue = 10;
        component.gridSize = newValue;

        expect(gridServiceStub.size).toEqual(newValue);
        expect(setValueSpy).toHaveBeenCalledWith(newValue, { emitEvent: false });
    });

    it("set gridOpacity should update the gridService's gridOpacity and set the formGroup's value", () => {
        const gridServiceStub = ({ opacity: initialGridOpacity } as unknown) as GridService;
        const setValueSpy = spyOn(formGroupStub.controls.gridOpacity, 'setValue');
        component['gridService'] = gridServiceStub;

        const newValue = 10;
        component.gridOpacity = newValue;

        expect(gridServiceStub.opacity).toEqual(newValue);
        expect(setValueSpy).toHaveBeenCalledWith(newValue, { emitEvent: false });
    });
});

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { GridService } from '@app/drawing/services/grid.service';
import { GridSettingsComponent } from '@app/modals/components/settings/grid-settings/grid-settings.component';
import { SettingsService } from '@app/modals/services/settings.service';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import { Subject } from 'rxjs';

// tslint:disable: no-string-literal

describe('GridSettingsComponent', () => {
    let component: GridSettingsComponent;
    let fixture: ComponentFixture<GridSettingsComponent>;
    let gridServiceSpyObj: jasmine.SpyObj<GridService>;
    let displayEnabledFormControlSpyObj: jasmine.SpyObj<FormControl>;
    let sizeFormControlSpyObj: jasmine.SpyObj<FormControl>;
    let opacityFormControlSpyObj: jasmine.SpyObj<FormControl>;
    let formGroupSpyObj: jasmine.SpyObj<FormGroup>;
    let settingServiceSpyObj: jasmine.SpyObj<SettingsService>;

    let gridDisplayChangedSubject: Subject<void>;
    let gridSizeChangedSubject: Subject<void>;
    let gridOpacityChangedSubject: Subject<void>;

    const initialGridSize = 10;
    const gridMinimumSize = 0;
    const gridMaximumSize = 100;
    const initialGridSizeVatiation = 5;
    const initialGridOpacity = 1;
    const gridMinimumOpacity = 0;
    const gridMaximumOpacity = 1;
    const isGridDisplayEnabled = true;

    beforeEach(async(() => {
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

        gridDisplayChangedSubject = new Subject<void>();
        displayEnabledFormControlSpyObj = jasmine.createSpyObj('FormControl', [], {
            valueChanges: gridDisplayChangedSubject,
            valid: true,
            value: isGridDisplayEnabled,
        });
        gridSizeChangedSubject = new Subject<void>();
        sizeFormControlSpyObj = jasmine.createSpyObj('FormControl', ['enable', 'disable', 'setValue'], {
            valueChanges: gridSizeChangedSubject,
            valid: true,
            value: initialGridSize,
        });
        gridOpacityChangedSubject = new Subject<void>();
        opacityFormControlSpyObj = jasmine.createSpyObj('FormControl', ['enable', 'disable', 'setValue'], {
            valueChanges: gridOpacityChangedSubject,
            valid: true,
            value: initialGridOpacity,
        });
        formGroupSpyObj = jasmine.createSpyObj('FormGroup', [], {
            controls: {
                gridDisplayEnabled: displayEnabledFormControlSpyObj,
                gridSize: sizeFormControlSpyObj,
                gridOpacity: opacityFormControlSpyObj,
            },
        });
        settingServiceSpyObj = jasmine.createSpyObj('SettingsService', [], {
            settingsFormGroup: formGroupSpyObj,
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
        const gridDisplayEnabledSpy = spyOn(gridDisplayChangedSubject, 'subscribe').and.callThrough();
        const gridSizeSpy = spyOn(gridSizeChangedSubject, 'subscribe').and.callThrough();
        const gridOpacity = spyOn(gridOpacityChangedSubject, 'subscribe').and.callThrough();
        component.ngOnInit();

        expect(gridDisplayEnabledSpy).toHaveBeenCalled();
        expect(gridSizeSpy).toHaveBeenCalled();
        expect(gridOpacity).toHaveBeenCalled();
    });

    it("should change the gridService's gridDisplay, gridSize and gridOpacity on valid change", async(() => {
        const gridServiceStub = ({ isDisplayEnabled: false, size: 0, opacity: 0 } as unknown) as GridService;
        component['gridService'] = gridServiceStub;

        gridDisplayChangedSubject.next();
        gridSizeChangedSubject.next();
        gridOpacityChangedSubject.next();
        expect(gridServiceStub.isDisplayEnabled).toEqual(isGridDisplayEnabled);
        expect(gridServiceStub.size).toEqual(initialGridSize);
        expect(gridServiceStub.opacity).toEqual(initialGridOpacity);
    }));

    it("should not change the gridService's gridDisplay, gridSize and gridOpacity on invalid change", async(() => {
        const expectedValue = 0;
        const gridServiceStub = ({ isDisplayEnabled: true, size: expectedValue, opacity: expectedValue } as unknown) as GridService;
        component['gridService'] = gridServiceStub;

        const unexpectedValue = 20;
        const invalidGridDisplaySpyObj = jasmine.createSpyObj('FormControl', [], {
            valid: false,
            value: unexpectedValue,
            valueChanges: gridDisplayChangedSubject,
        });
        const invalidGridSizeSpyObj = jasmine.createSpyObj('FormControl', [], {
            valid: false,
            value: unexpectedValue,
            valueChanges: gridSizeChangedSubject,
        });
        const invalidGridOpacitySpyObj = jasmine.createSpyObj('FormControl', [], {
            valid: false,
            value: unexpectedValue,
            valueChanges: gridOpacityChangedSubject,
        });
        const invalidFormGroupSpyObj = jasmine.createSpyObj('FormGroup', [], {
            controls: {
                gridDisplayEnabled: invalidGridDisplaySpyObj,
                gridSize: invalidGridSizeSpyObj,
                gridOpacity: invalidGridOpacitySpyObj,
            },
        });

        component['settingsService'] = jasmine.createSpyObj('SettingsService', [], {
            settingsFormGroup: invalidFormGroupSpyObj,
        });

        component.ngOnInit();
        gridDisplayChangedSubject.next();
        gridSizeChangedSubject.next();
        gridOpacityChangedSubject.next();
        expect(gridServiceStub.isDisplayEnabled).toEqual(true);
        expect(gridServiceStub.size).toEqual(expectedValue);
        expect(gridServiceStub.opacity).toEqual(expectedValue);
    }));

    it('#ngOnDestroy should unsubscribe from gridDisplay, gridSize and gridOpacity change subscriptions', () => {
        const displayEnabledSubscriptionSpy = spyOn(component['gridDisplayEnabledChangedSubscription'], 'unsubscribe');
        const sizeSubscriptionSpy = spyOn(component['gridSizeChangedSubscription'], 'unsubscribe');
        const opacitySubscriptionSpy = spyOn(component['gridOpacityChangedSubscription'], 'unsubscribe');

        component.ngOnDestroy();

        expect(displayEnabledSubscriptionSpy).toHaveBeenCalled();
        expect(sizeSubscriptionSpy).toHaveBeenCalled();
        expect(opacitySubscriptionSpy).toHaveBeenCalled();
    });

    it('#getErrorMessage should forward the call the ErrorMessageService', () => {
        const errorMessageServiceSpy = spyOn(ErrorMessageService, 'getErrorMessage');
        const humanFriendlyPattern = 'This is a test';

        component.getErrorMessage(sizeFormControlSpyObj, humanFriendlyPattern);
        expect(errorMessageServiceSpy).toHaveBeenCalledWith(sizeFormControlSpyObj, humanFriendlyPattern);
    });

    it('set isGridDisplayEnabled should enable the gridSize and gridOpacity if it is set to true', () => {
        const gridServiceMock = { isDisplayEnabled: false } as GridService;
        component['gridService'] = gridServiceMock;
        component.isGridDisplayEnabled = true;

        expect(gridServiceMock.isDisplayEnabled).toEqual(true);
        expect(sizeFormControlSpyObj.enable).toHaveBeenCalled();
        expect(opacityFormControlSpyObj.enable).toHaveBeenCalled();
    });

    it('set isGridDisplayEnabled should disable the gridSize and gridOpacity if it is set to false', () => {
        const gridServiceMock = { isDisplayEnabled: true } as GridService;
        component['gridService'] = gridServiceMock;
        component.isGridDisplayEnabled = false;

        expect(gridServiceMock.isDisplayEnabled).toEqual(false);
        expect(sizeFormControlSpyObj.disable).toHaveBeenCalled();
        expect(opacityFormControlSpyObj.disable).toHaveBeenCalled();
    });

    it("set gridSize should update the gridService's gridSize and set the formGroup's value", () => {
        const gridServiceStub = ({ size: initialGridSize } as unknown) as GridService;
        component['gridService'] = gridServiceStub;

        const newValue = 10;
        component.gridSize = newValue;

        expect(gridServiceStub.size).toEqual(newValue);
        expect(sizeFormControlSpyObj.setValue).toHaveBeenCalledWith(newValue, { emitEvent: false });
    });

    it("set gridOpacity should update the gridService's gridOpacity and set the formGroup's value", () => {
        const gridServiceStub = ({ opacity: initialGridOpacity } as unknown) as GridService;
        component['gridService'] = gridServiceStub;

        const newValue = 10;
        component.gridOpacity = newValue;

        expect(gridServiceStub.opacity).toEqual(newValue);
        expect(opacityFormControlSpyObj.setValue).toHaveBeenCalledWith(newValue, { emitEvent: false });
    });
});

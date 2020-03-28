import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { SettingsComponent } from '@app/modals/components/settings/settings/settings.component';
import { SettingsService } from '@app/modals/services/settings.service';

describe('SettingsComponent', () => {
    let component: SettingsComponent;
    let fixture: ComponentFixture<SettingsComponent>;
    let settingsServiceSpyObj: jasmine.SpyObj<SettingsService>;
    const settingsFormGroupStub = {} as FormGroup;

    beforeEach(async(() => {
        settingsServiceSpyObj = jasmine.createSpyObj('SettingsService', ['resetInitialSettings'], {
            settingsFormGroup: settingsFormGroupStub,
        });
        TestBed.configureTestingModule({
            declarations: [SettingsComponent],
            providers: [{ provide: SettingsService, useValue: settingsServiceSpyObj }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#resetInitialSettings should forward the call to settingsService', () => {
        component.resetInitialSettings();
        expect(settingsServiceSpyObj.resetInitialSettings).toHaveBeenCalled();
    });
});

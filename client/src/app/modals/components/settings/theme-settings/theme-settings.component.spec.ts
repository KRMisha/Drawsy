import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeSettingsComponent } from '@app/modals/components/settings/theme-settings/theme-settings.component';

describe('ThemeSettingsComponent', () => {
    let component: ThemeSettingsComponent;
    let fixture: ComponentFixture<ThemeSettingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ThemeSettingsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ThemeSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

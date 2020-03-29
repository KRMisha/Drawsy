import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeService } from '@app/app/services/theme.service';
import { ThemeSettingsComponent } from '@app/modals/components/settings/theme-settings/theme-settings.component';

describe('ThemeSettingsComponent', () => {
    let component: ThemeSettingsComponent;
    let fixture: ComponentFixture<ThemeSettingsComponent>;
    const initialColor = 'InitialColor';
    const themeServiceStub = { color: initialColor, isDarkTheme: true } as ThemeService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ThemeSettingsComponent],
            providers: [{ provide: ThemeService, useValue: themeServiceStub }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

    it("set color should update the themeService's color", () => {
        const newColor = 'New color';
        component.color = newColor;
        expect(themeServiceStub.color).toEqual(newColor);
    });

    it("set isDarkTheme should update the themeService's isDarkTheme", () => {
        component.isDarkTheme = false;
        expect(themeServiceStub.isDarkTheme).toEqual(false);
    });
});

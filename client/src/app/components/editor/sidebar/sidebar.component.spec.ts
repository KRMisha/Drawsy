import { Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { AppModule } from 'src/app/app.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { ColorContainerComponent } from '../../color-picker/color-container/color-container.component';
import { ColorFieldComponent } from '../../color-picker/color-field/color-field.component';
import { ColorPickerComponent } from '../../color-picker/color-picker.component';
import { ColorSliderComponent } from '../../color-picker/color-slider/color-slider.component';
import { PanelSettingsComponent } from '../panel-settings/panel-settings.component';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SidebarComponent,
                PanelSettingsComponent,
                ColorPickerComponent,
                ColorSliderComponent,
                ColorFieldComponent,
                ColorContainerComponent
            ],
            imports: [MatSidenavModule, MatIconModule, MatSliderModule, Input]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

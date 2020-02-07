import { Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { AppModule } from 'src/app/app.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { ColorContainerComponent } from '../color-picker/color-container/color-container.component';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { DrawingComponent } from '../drawing/drawing.component';
import { EditorComponent } from './editor.component';
import { PanelSettingsComponent } from './panel-settings/panel-settings.component';
import { SidebarComponent } from './sidebar/sidebar.component';

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                EditorComponent,
                SidebarComponent,
                DrawingComponent,
                PanelSettingsComponent,
                ColorContainerComponent,
                ColorPickerComponent
            ],
            imports: [
                MatIconModule,
                MatSidenavModule,
                MatSliderModule,
                Input
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { SidebarButton } from 'src/app/classes/sidebar-button/sidebar-button';
import { ColorService } from 'src/app/services/color/color.service';
import { PanelSettingsComponent } from './panel-settings.component';

fdescribe('PanelSettingsComponent', () => {
    let component: PanelSettingsComponent;
    let fixture: ComponentFixture<PanelSettingsComponent>;

    let colorServiceSpyObj: jasmine.SpyObj<ColorService>;
    let selectedButtonSpyObj: jasmine.SpyObj<SidebarButton>;

    beforeEach(async(() => {
        selectedButtonSpyObj = jasmine.createSpyObj(
            {toolIndex: 1}
        );

        colorServiceSpyObj = jasmine.createSpyObj({'': ''});
        TestBed.configureTestingModule({
            imports: [MatSliderModule, MatCheckboxModule, FormsModule, MatSelectModule],
            declarations: [PanelSettingsComponent],
            providers: [
                { provide: ColorService, useValue: colorServiceSpyObj}
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PanelSettingsComponent);
        component = fixture.componentInstance;
        component.selectedButton = selectedButtonSpyObj;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

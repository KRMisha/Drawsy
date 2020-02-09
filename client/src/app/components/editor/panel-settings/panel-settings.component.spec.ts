import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { ColorService } from 'src/app/services/color/color.service';
import { ToolSelectorService } from 'src/app/services/drawing/tool-selector/tool-selector.service';
import { PanelSettingsComponent } from './panel-settings.component';

fdescribe('PanelSettingsComponent', () => {
    let component: PanelSettingsComponent;
    let fixture: ComponentFixture<PanelSettingsComponent>;
    let colorServiceSpyObj: jasmine.SpyObj<ColorService>;
    let toolSelectorServiceSpyObj: jasmine.SpyObj<ToolSelectorService>;
    beforeEach(async(() => {
        toolSelectorServiceSpyObj = jasmine.createSpyObj({ hasSetting: false, getToolName: '' });
        colorServiceSpyObj = jasmine.createSpyObj({ getPrimaryColor: {}, getSecondaryColor: {} });
        TestBed.configureTestingModule({
            declarations: [PanelSettingsComponent],
            imports: [MatSliderModule, MatCheckboxModule, FormsModule, MatSelectModule],
            providers: [
                { provide: ToolSelectorService, useValue: toolSelectorServiceSpyObj },
                { provide: ColorService, useValue: colorServiceSpyObj },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PanelSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

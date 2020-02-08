import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolHolderService } from 'src/app/services/drawing/tool-holder/tool-holder.service';
import { ToolSelectorService } from 'src/app/services/drawing/tool-selector/tool-selector.service';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolSelectorServiceSpyObj: jasmine.SpyObj<ToolSelectorService>;
    let toolHolderServiceSpyObj: jasmine.SpyObj<ToolHolderService>;

    beforeEach(async(() => {
        toolSelectorServiceSpyObj = jasmine.createSpyObj({setSelectedTool: ''});
        toolHolderServiceSpyObj = jasmine.createSpyObj({'': ''});
        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            imports: [BrowserAnimationsModule, MatSidenavModule, MatIconModule, MatSliderModule, MatDialogModule],
            providers: [
                {provide: ToolSelectorService, useValue: toolSelectorServiceSpyObj},
                {provide: ToolHolderService, useValue: toolHolderServiceSpyObj}
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

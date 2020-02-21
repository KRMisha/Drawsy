import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarButton } from 'src/app/classes/sidebar-button/sidebar-button';
import { ToolSelectorService } from 'src/app/drawing/services/tool-selector.service';
import { ModalService } from 'src/app/modals/services/modal.service';
import { CreateDrawingComponent } from '../../modals/create-drawing/create-drawing.component';
import { GuideComponent } from '../../guide/guide.component';
import { DrawingSettingsComponent } from '../drawing-settings/drawing-settings.component';
import { SidebarComponent } from './sidebar.component';

class MockModalService {
    isModalPresent = false;
    openDialog() {
        return;
    }
}

// tslint:disable: no-string-literal
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolSelectorServiceSpyObj: jasmine.SpyObj<ToolSelectorService>;
    let mockModalService: MockModalService;

    beforeEach(async(() => {
        toolSelectorServiceSpyObj = jasmine.createSpyObj({
            setSelectedTool() {
                return;
            },
        });
        mockModalService = new MockModalService();
        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            imports: [BrowserAnimationsModule, MatSidenavModule, MatIconModule, MatSliderModule, MatDialogModule],
            providers: [
                { provide: ToolSelectorService, useValue: toolSelectorServiceSpyObj },
                { provide: ModalService, useValue: mockModalService },
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

    it('#ngOnInit should set the selected tool of injected tool selector service', () => {
        component.ngOnInit();

        expect(toolSelectorServiceSpyObj.setSelectedTool).toHaveBeenCalled();
    });

    it('#onKeyDown should set the selected tool in the tool selector if there are no modals shown and shortcuts are enabled', () => {
        mockModalService.isModalPresent = false;
        component['areShortcutsEnabled'] = true;

        spyOn(component, 'setSelectedTool');

        component.onKeyDown({ key: '1' } as KeyboardEvent);
        expect(component.setSelectedTool).toHaveBeenCalledWith(3);

        component.onKeyDown({ key: 'c' } as KeyboardEvent);
        expect(component.setSelectedTool).toHaveBeenCalledWith(0);

        component.onKeyDown({ key: 'l' } as KeyboardEvent);
        expect(component.setSelectedTool).toHaveBeenCalledWith(2);

        component.onKeyDown({ key: 'w' } as KeyboardEvent);
        expect(component.setSelectedTool).toHaveBeenCalledWith(1);
    });

    it('#onKeyDown should not change the selected tool in the tool selector if the shortcut is not linked to a tool', () => {
        mockModalService.isModalPresent = false;
        component['areShortcutsEnabled'] = true;

        spyOn(component, 'setSelectedTool');

        component.onKeyDown({ key: '3' } as KeyboardEvent);
        expect(component.setSelectedTool).not.toHaveBeenCalled();
    });

    it('#onKeyDown should not change selectedTool if modal is shown or shortcuts are disabled', () => {
        spyOn(component, 'setSelectedTool');

        mockModalService.isModalPresent = true;
        component['areShortcutsEnabled'] = true;
        component.onKeyDown({ key: 'w' } as KeyboardEvent);

        mockModalService.isModalPresent = false;
        component['areShortcutsEnabled'] = false;
        component.onKeyDown({ key: 'w' } as KeyboardEvent);

        mockModalService.isModalPresent = true;
        component['areShortcutsEnabled'] = false;
        component.onKeyDown({ key: 'w' } as KeyboardEvent);

        expect(component.setSelectedTool).not.toHaveBeenCalled();
    });

    it('#onFocusIn should disable shortcuts if eventTarget is a HTMLInputElement', () => {
        component['areShortcutsEnabled'] = true;
        component.onFocusIn(({ target: document.createElement('input') } as any) as FocusEvent);
        expect(component['areShortcutsEnabled']).toEqual(false);
    });

    it('#onFocusIn should not change shortcuts availability if eventTarget is not a HTMLInputElement', () => {
        component['areShortcutsEnabled'] = true;
        component.onFocusIn(({ target: {} as boolean } as unknown) as FocusEvent);
        expect(component['areShortcutsEnabled']).toEqual(true);
    });

    it('#onFocusOut should enable shortcuts if eventTarget is a HTMLInputElement', () => {
        component['areShortcutsEnabled'] = false;
        component.onFocusOut(({ target: document.createElement('input') } as any) as FocusEvent);
        expect(component['areShortcutsEnabled']).toEqual(true);
    });

    it('#onFocusOut should not change shortcuts availability if eventTarget is not a HTMLInputElement', () => {
        component['areShortcutsEnabled'] = false;
        component.onFocusOut(({ target: {} as boolean } as unknown) as FocusEvent);
        expect(component['areShortcutsEnabled']).toEqual(false);
    });
    it("#setSelectedTool should not update its selected button and the tool selector's tool if index is out of range", () => {
        spyOn(component.drawer, 'open');
        component.buttons = [{} as SidebarButton, {} as SidebarButton] as SidebarButton[];

        component.setSelectedTool(-1);
        component.setSelectedTool(4);
        expect(component.drawer.open).not.toHaveBeenCalled();
        // Expect to have been called once because it will have been called in the ngOnInit
        expect(toolSelectorServiceSpyObj.setSelectedTool).toHaveBeenCalledTimes(1);
    });

    it("#setSelectedTool should update its selected button and the tool selector's tool if index is in range", () => {
        spyOn(component.drawer, 'open');
        component.buttons = [{} as SidebarButton, {} as SidebarButton] as SidebarButton[];

        component.setSelectedTool(1);
        expect(component.drawer.open).toHaveBeenCalled();
        expect(toolSelectorServiceSpyObj.setSelectedTool).toHaveBeenCalled();
    });

    it('#openGuideModal should forward the request to modal service', () => {
        spyOn(mockModalService, 'openDialog');
        component.openGuideModal();

        expect(mockModalService.openDialog).toHaveBeenCalledWith(GuideComponent, { x: 1920, y: 1080 });
    });

    it('#openCreateDrawingModal should forward the request to modal service', () => {
        spyOn(mockModalService, 'openDialog');
        component.openCreateDrawingModal();

        expect(mockModalService.openDialog).toHaveBeenCalledWith(CreateDrawingComponent);
    });

    it('#openSettingsModal should forward the request to modal service', () => {
        spyOn(mockModalService, 'openDialog');
        component.openSettingsModal();

        expect(mockModalService.openDialog).toHaveBeenCalledWith(DrawingSettingsComponent);
    });
});

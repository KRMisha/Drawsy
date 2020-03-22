// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatIconModule } from '@angular/material/icon';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatSliderModule } from '@angular/material/slider';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { DrawingSettingsComponent } from '@app/drawing/components/drawing-settings/drawing-settings.component';
// import { SidebarButton } from '@app/editor/classes/sidebar-button';
// import { SidebarComponent } from '@app/editor/components/sidebar/sidebar.component';
// import { GuideComponent } from '@app/guide/components/guide/guide.component';
// import { ExportDrawingComponent } from '@app/modals/components/export-drawing/export-drawing.component';
// import { GalleryComponent } from '@app/modals/components/gallery/gallery.component';
// import { NewDrawingComponent } from '@app/modals/components/new-drawing/new-drawing.component';
// import { SaveDrawingComponent } from '@app/modals/components/save-drawing/save-drawing.component';
// import { ModalService } from '@app/modals/services/modal.service';
// import { CurrentToolService } from '@app/tools/services/current-tool.service';

// // tslint:disable: no-empty
// // tslint:disable: no-magic-numbers
// // tslint:disable: no-string-literal

// describe('SidebarComponent', () => {
//     let component: SidebarComponent;
//     let fixture: ComponentFixture<SidebarComponent>;
//     let currentToolServiceSpyObj: jasmine.SpyObj<CurrentToolService>;
//     let modalServiceSpyObj: jasmine.SpyObj<ModalService>;

//     beforeEach(async(() => {
//         currentToolServiceSpyObj = jasmine.createSpyObj({
//             setSelectedTool: () => {},
//         });
//         modalServiceSpyObj = jasmine.createSpyObj('ModalService', ['openDialog'], ['isModalPresent']);
//         TestBed.configureTestingModule({
//             declarations: [SidebarComponent],
//             imports: [BrowserAnimationsModule, MatSidenavModule, MatIconModule, MatSliderModule, MatDialogModule],
//             providers: [
//                 { provide: CurrentToolService, useValue: currentToolServiceSpyObj },
//                 { provide: ModalService, useValue: modalServiceSpyObj },
//             ],
//             schemas: [CUSTOM_ELEMENTS_SCHEMA],
//         }).compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(SidebarComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('#ngOnInit should set the selected tool of injected tool selector service', () => {
//         component.ngOnInit();

//         expect(currentToolServiceSpyObj.setSelectedTool).toHaveBeenCalled();
//     });

//     it('#onKeyDown should set the selected tool in the tool selector if there are no modals shown and shortcuts are enabled', () => {
//         component['areShortcutsEnabled'] = true;

//         spyOn(component, 'setSelectedTool');

//         component.onKeyDown({ key: '1' } as KeyboardEvent);
//         expect(component.setSelectedTool).toHaveBeenCalledWith(3);

//         component.onKeyDown({ key: 'c' } as KeyboardEvent);
//         expect(component.setSelectedTool).toHaveBeenCalledWith(0);

//         component.onKeyDown({ key: 'l' } as KeyboardEvent);
//         expect(component.setSelectedTool).toHaveBeenCalledWith(2);

//         component.onKeyDown({ key: 'w' } as KeyboardEvent);
//         expect(component.setSelectedTool).toHaveBeenCalledWith(1);
//     });

//     it('#onKeyDown should not change the selected tool in the tool selector if the shortcut is not linked to a tool', () => {
//         component['areShortcutsEnabled'] = true;

//         spyOn(component, 'setSelectedTool');

//         component.onKeyDown({ key: '3' } as KeyboardEvent);
//         expect(component.setSelectedTool).not.toHaveBeenCalled();
//     });

//     it('#onKeyDown should not change selectedTool if modal is shown or shortcuts are disabled', () => {
//         spyOn(component, 'setSelectedTool');

//         component['areShortcutsEnabled'] = true;
//         component.onKeyDown({ key: 'w' } as KeyboardEvent);

//         component['areShortcutsEnabled'] = false;
//         component.onKeyDown({ key: 'w' } as KeyboardEvent);

//         component['areShortcutsEnabled'] = false;
//         component.onKeyDown({ key: 'w' } as KeyboardEvent);

//         expect(component.setSelectedTool).not.toHaveBeenCalled();
//     });

//     it('#onFocusIn should disable shortcuts if eventTarget is a HTMLInputElement', () => {
//         component['areShortcutsEnabled'] = true;
//         component.onFocusIn(({ target: document.createElement('input') } as unknown) as FocusEvent);
//         expect(component['areShortcutsEnabled']).toEqual(false);
//     });

//     it('#onFocusIn should not change shortcuts availability if eventTarget is not a HTMLInputElement', () => {
//         component['areShortcutsEnabled'] = true;
//         component.onFocusIn(({ target: {} as boolean } as unknown) as FocusEvent);
//         expect(component['areShortcutsEnabled']).toEqual(true);
//     });

//     it('#onFocusOut should enable shortcuts if eventTarget is a HTMLInputElement', () => {
//         component['areShortcutsEnabled'] = false;
//         component.onFocusOut(({ target: document.createElement('input') } as unknown) as FocusEvent);
//         expect(component['areShortcutsEnabled']).toEqual(true);
//     });

//     it('#onFocusOut should not change shortcuts availability if eventTarget is not a HTMLInputElement', () => {
//         component['areShortcutsEnabled'] = false;
//         component.onFocusOut(({ target: {} as boolean } as unknown) as FocusEvent);
//         expect(component['areShortcutsEnabled']).toEqual(false);
//     });
//     it("#setSelectedTool should not update its selected button and the tool selector's tool if index is out of range", () => {
//         spyOn(component.drawer, 'open');
//         component.buttons = [{} as SidebarButton, {} as SidebarButton] as SidebarButton[];

//         component.setSelectedTool(-1);
//         component.setSelectedTool(4);
//         expect(component.drawer.open).not.toHaveBeenCalled();
//         // Expect to have been called once because it will have been called in the ngOnInit
//         expect(currentToolServiceSpyObj.setSelectedTool).toHaveBeenCalledTimes(1);
//     });

//     it("#setSelectedTool should update its selected button and the tool selector's tool if index is in range", () => {
//         spyOn(component.drawer, 'open');
//         component.buttons = [{} as SidebarButton, {} as SidebarButton] as SidebarButton[];

//         component.setSelectedTool(1);
//         expect(component.drawer.open).toHaveBeenCalled();
//         expect(currentToolServiceSpyObj.setSelectedTool).toHaveBeenCalled();
//     });

//     it('#openSettingsModal should forward the request to modal service', () => {
//         component.openSettingsModal();
//         expect(modalServiceSpyObj.openDialog).toHaveBeenCalledWith(DrawingSettingsComponent, { x: 425, y: 675 });
//     });

//     it('#openExportModal should forward the request to modal service', () => {
//         component.openGuideModal();

//         expect(modalServiceSpyObj.openDialog).toHaveBeenCalledWith(ExportDrawingComponent, { x: 1000, y: 1000 });
//     });

//     it('#openSaveModal should forward the request to modal service', () => {
//         component.openNewDrawingModal();
//         expect(modalServiceSpyObj.openDialog).toHaveBeenCalledWith(SaveDrawingComponent, { x: 1000, y: 1000 });
//     });

//     it('#openNewDrawingModal should forward the request to modal service', () => {
//         component.openSettingsModal();
//         expect(modalServiceSpyObj.openDialog).toHaveBeenCalledWith(NewDrawingComponent, { x: 425, y: 500 });
//     });

//     it('#openGuideModal should forward the request to modal service', () => {
//         component.openGuideModal();

//         expect(modalServiceSpyObj.openDialog).toHaveBeenCalledWith(GuideComponent, { x: 1920, y: 1080 });
//     });

//     it('#openGalleryModal should forward the request to modal service', () => {
//         component.openNewDrawingModal();
//         expect(modalServiceSpyObj.openDialog).toHaveBeenCalledWith(GalleryComponent, { x: 1920, y: 900 });
//     });
// });

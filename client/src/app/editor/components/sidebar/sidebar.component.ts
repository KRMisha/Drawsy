import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { DrawingSettingsComponent } from '@app/drawing/components/drawing-settings/drawing-settings.component';
import { CommandService } from '@app/drawing/services/command.service';
import { SidebarButton, sidebarButtons } from '@app/editor/classes/sidebar-button';
import { GuideComponent } from '@app/guide/components/guide/guide.component';
import { ExportDrawingComponent } from '@app/modals/components/export-drawing/export-drawing.component';
import { GalleryComponent } from '@app/modals/components/gallery/gallery.component';
import { NewDrawingComponent } from '@app/modals/components/new-drawing/new-drawing.component';
import { SaveDrawingComponent } from '@app/modals/components/save-drawing/save-drawing.component';
import { ModalService } from '@app/modals/services/modal.service';
import { CurrentToolService } from '@app/tools/services/current-tool.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    @ViewChild('appDrawer') drawer: MatDrawer;

    buttons: SidebarButton[] = sidebarButtons;
    selectedButton: SidebarButton = this.buttons[0];

    private areShortcutsEnabled = true;

    constructor(
        private currentToolService: CurrentToolService,
        private modalService: ModalService,
        private commandService: CommandService
    ) {}

    ngOnInit(): void {
        this.currentToolService.setSelectedTool(this.selectedButton.toolIndex);
    }

    // tslint:disable-next-line: cyclomatic-complexity
    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (!this.modalService.isModalPresent && this.areShortcutsEnabled) {
            switch (event.key) {
                // tslint:disable: no-magic-numbers
                case '1':
                    this.setSelectedTool(4);
                    break;
                case '2':
                    this.setSelectedTool(5);
                    break;
                case '3':
                    this.setSelectedTool(6);
                    break;
                case 'a':
                    if (!event.ctrlKey) {
                        this.setSelectedTool(3);
                    }
                    break;
                case 'c':
                    this.setSelectedTool(0);
                    break;
                case 'e':
                    if (event.ctrlKey) {
                        event.preventDefault();
                        this.modalService.openDialog(ExportDrawingComponent, { x: 1000, y: 1000 });
                    } else {
                        this.setSelectedTool(10);
                    }
                    break;
                case 'i':
                    this.setSelectedTool(7);
                    break;
                case 'l':
                    this.setSelectedTool(2);
                    break;
                case 'r':
                    this.setSelectedTool(8);
                    break;
                case 's':
                    if (event.ctrlKey) {
                        event.preventDefault();
                        this.modalService.openDialog(SaveDrawingComponent, { x: 1000, y: 1000 });
                    } else {
                        this.setSelectedTool(9);
                    }
                    break;
                case 'w':
                    this.setSelectedTool(1);
                    break;
                // tslint:enable: no-magic-numbers
                case 'z': {
                    if (event.ctrlKey) {
                        this.undo();
                        event.preventDefault();
                    }
                    break;
                }
                case 'Z': {
                    if (event.ctrlKey) {
                        this.redo();
                        event.preventDefault();
                    }
                    break;
                }
            }
        }
    }

    @HostListener('document:focusin', ['$event'])
    onFocusIn(event: FocusEvent): void {
        if (event.target instanceof HTMLInputElement) {
            this.areShortcutsEnabled = false;
        }
    }

    @HostListener('document:focusout', ['$event'])
    onFocusOut(event: FocusEvent): void {
        if (event.target instanceof HTMLInputElement) {
            this.areShortcutsEnabled = true;
        }
    }

    setSelectedTool(toolIndex: number): void {
        if (toolIndex < 0 || toolIndex >= this.buttons.length) {
            return;
        }
        this.drawer.open();
        this.selectedButton = this.buttons[toolIndex];
        this.currentToolService.setSelectedTool(toolIndex);
    }

    openSettingsModal(): void {
        this.modalService.openDialog(DrawingSettingsComponent, { x: 425, y: 760 });
    }

    openExportModal(): void {
        this.modalService.openDialog(ExportDrawingComponent, { x: 1000, y: 1000 });
    }

    openSaveModal(): void {
        this.modalService.openDialog(SaveDrawingComponent, { x: 1000, y: 1000 });
    }

    openNewDrawingModal(): void {
        this.modalService.openDialog(NewDrawingComponent, { x: 425, y: 500 });
    }

    openGuideModal(): void {
        this.modalService.openDialog(GuideComponent, { x: 1920, y: 1080 });
    }

    openGalleryModal(): void {
        this.modalService.openDialog(GalleryComponent, { x: 1920, y: 900 });
    }

    undo(): void {
        this.commandService.undo();
        this.currentToolService.selectedTool.onToolDeselection();
    }

    redo(): void {
        this.commandService.redo();
        this.currentToolService.selectedTool.onToolDeselection();
    }
}

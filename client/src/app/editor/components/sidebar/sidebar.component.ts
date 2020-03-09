import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { DrawingSettingsComponent } from '@app/drawing/components/drawing-settings/drawing-settings.component';
import { CommandService } from '@app/drawing/services/command.service';
import { SidebarButton, sidebarButtons } from '@app/editor/classes/sidebar-button';
import { GuideComponent } from '@app/guide/components/guide/guide.component';
import { ImportExportDrawingComponent } from '@app/modals/components/import-export-drawing/import-export-drawing.component';
import { NewDrawingComponent } from '@app/modals/components/new-drawing/new-drawing.component';
import { ModalService } from '@app/modals/services/modal.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    @ViewChild('appDrawer', { static: false }) drawer: MatDrawer;

    buttons: SidebarButton[] = sidebarButtons;
    selectedButton: SidebarButton = this.buttons[0];

    private areShortcutsEnabled = true;

    constructor(
        private toolSelectorService: ToolSelectorService,
        private modalService: ModalService,
        private commandService: CommandService,
    ) {}

    ngOnInit(): void {
        this.toolSelectorService.setSelectedTool(this.selectedButton.toolIndex);
    }

    // tslint:disable-next-line: cyclomatic-complexity
    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (!this.modalService.isModalPresent && this.areShortcutsEnabled) {
            switch (event.key) {
                // tslint:disable: no-magic-numbers
                case '1':
                    this.setSelectedTool(3);
                    break;
                case '2':
                    this.setSelectedTool(4);
                    break;
                case '3':
                    this.setSelectedTool(5);
                    break;
                case 'a':
                    this.setSelectedTool(9);
                    break;
                case 'c':
                    this.setSelectedTool(0);
                    break;
                case 'e':
                    this.setSelectedTool(8);
                    break;
                case 'i':
                    this.setSelectedTool(6);
                    break;
                case 'l':
                    this.setSelectedTool(2);
                    break;
                case 's':
                    this.setSelectedTool(7);
                    break;
                case 'w':
                    this.setSelectedTool(1);
                    break;
                // tslint:enable: no-magic-numbers
                case 'z': {
                    if (event.ctrlKey) {
                        this.undo();
                    }
                    break;
                }
                case 'Z': {
                    if (event.ctrlKey) {
                        this.redo();
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
        this.toolSelectorService.setSelectedTool(toolIndex);
    }

    openSettingsModal(): void {
        this.modalService.openDialog(DrawingSettingsComponent, { x: 425, y: 675 });
    }

    openImportExportModal(): void {
        this.modalService.openDialog(ImportExportDrawingComponent, { x: 1000, y: 1000 });
    }

    openNewDrawingModal(): void {
        this.modalService.openDialog(NewDrawingComponent, { x: 425, y: 500 });
    }

    openGuideModal(): void {
        this.modalService.openDialog(GuideComponent, { x: 1920, y: 1080 });
    }

    undo(): void {
      this.commandService.undo();
      this.toolSelectorService.selectedTool.onToolDeselection();
    }

    redo(): void {
      this.commandService.redo();
      this.toolSelectorService.selectedTool.onToolDeselection();
    }
}

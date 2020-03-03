import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { SidebarButton, sidebarButtons } from '@app/editor/classes/sidebar-button';
import { DrawingSettingsComponent } from '@app/editor/components/drawing-settings/drawing-settings.component';
import { GuideComponent } from '@app/guide/components/guide/guide.component';
import { NewDrawingComponent } from '@app/modals/components/new-drawing/new-drawing.component';
import { ModalService } from '@app/modals/services/modal.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    buttons: SidebarButton[] = sidebarButtons;
    selectedButton: SidebarButton = this.buttons[0];

    @ViewChild('appDrawer', { static: false }) drawer: MatDrawer;

    private areShortcutsEnabled = true;

    constructor(private toolSelectorService: ToolSelectorService, private modalService: ModalService) {}

    ngOnInit(): void {
        this.toolSelectorService.setSelectedTool(this.selectedButton.toolIndex);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (!this.modalService.isModalPresent && this.areShortcutsEnabled) {
            switch (event.key) {
                // tslint:disable: no-magic-numbers
                case '1':
                    this.setSelectedTool(3);
                    break;
                case 'c':
                    this.setSelectedTool(0);
                    break;
                case 'l':
                    this.setSelectedTool(2);
                    break;
                case 'w':
                    this.setSelectedTool(1);
                    break;
                // tslint:enable: no-magic-numbers
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

    openGuideModal(): void {
        this.modalService.openDialog(GuideComponent, { x: 1920, y: 1080 });
    }

    openNewDrawingModal(): void {
        this.modalService.openDialog(NewDrawingComponent, { x: 600, y: 600 });
    }

    openSettingsModal(): void {
        this.modalService.openDialog(DrawingSettingsComponent, { x: 600, y: 600 });
    }
}

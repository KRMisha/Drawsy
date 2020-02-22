import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { SidebarButton, sidebarButtons } from '../../../classes/sidebar-button/sidebar-button';
import { GuideComponent } from '../../../guide/components/guide/guide.component';
import { NewDrawingComponent } from '../../../modals/components/new-drawing/new-drawing.component';
import { ModalService } from '../../../modals/services/modal.service';
import { ToolSelectorService } from '../../../tools/services/tool-selector.service';
import { DrawingSettingsComponent } from '../drawing-settings/drawing-settings.component';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    buttons: SidebarButton[] = sidebarButtons;
    selectedButton: SidebarButton = this.buttons[0];

    @ViewChild('drawer', { static: false }) drawer: MatDrawer;

    private areShortcutsEnabled = true;

    constructor(private toolSelectorService: ToolSelectorService, private modalService: ModalService) {}

    ngOnInit(): void {
        this.toolSelectorService.setSelectedTool(this.selectedButton.toolIndex);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (!this.modalService.isModalPresent && this.areShortcutsEnabled) {
            switch (event.key) {
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
        this.modalService.openDialog(NewDrawingComponent);
    }

    openSettingsModal(): void {
        this.modalService.openDialog(DrawingSettingsComponent);
    }
}

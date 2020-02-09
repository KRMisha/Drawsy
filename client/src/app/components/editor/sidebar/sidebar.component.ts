import { Component, HostListener, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { SidebarButton, sidebarButtons } from '../../../classes/sidebar-button/sidebar-button';
import { ToolSelectorService } from '../../../services/drawing/tool-selector/tool-selector.service';
import { ModalService } from '../../../services/modal/modal.service';
import { CreateDrawingComponent } from '../../create-drawing/create-drawing.component';
import { GuideComponent } from '../../guide/guide.component';
import { DrawingSettingsComponent } from '../drawing-settings/drawing-settings.component';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    buttons: SidebarButton[] = sidebarButtons;
    selectedButton: SidebarButton;

    @ViewChild('drawer', { static: false }) drawer: MatDrawer;

    constructor(private toolSelectorService: ToolSelectorService, private modalService: ModalService) {
        this.selectedButton = this.buttons[0];
        this.toolSelectorService.setSelectedTool(this.selectedButton.toolIndex);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
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

    openCreateDrawingModal(): void {
        this.modalService.openDialog(CreateDrawingComponent);
    }

    openSettingsModal(): void {
        this.modalService.openDialog(DrawingSettingsComponent);
    }
}

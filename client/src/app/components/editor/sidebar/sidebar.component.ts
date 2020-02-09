import { Component } from '@angular/core';
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

    constructor(private toolSelectorService: ToolSelectorService, private modalService: ModalService) {
        this.selectedButton = this.buttons[0];
        this.toolSelectorService.setSelectedTool(this.selectedButton.toolIndex);
    }

    setSelectedTool(toolIndex: number): void {
        if (toolIndex < 0 || toolIndex >= this.buttons.length) {
            return;
        }
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

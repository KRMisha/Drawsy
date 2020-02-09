import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateDrawingComponent } from 'src/app/components/create-drawing/create-drawing.component';
import { SidebarButton, sidebarButtons } from '../../../classes/sidebar-button/sidebar-button';
import { ToolHolderService } from '../../../services/drawing/tool-holder/tool-holder.service';
import { ToolSelectorService } from '../../../services/drawing/tool-selector/tool-selector.service';
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

    constructor(private toolSelectorService: ToolSelectorService, public toolHolderService: ToolHolderService, private dialog: MatDialog) {
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
        this.dialog.open(GuideComponent, {
            width: '1920px',
            height: '1080px',
        });
    }

    openCreateNewDrawingModal(): void {
        this.dialog.open(CreateDrawingComponent, {});
    }

    openSettings(): void {
        this.dialog.open(DrawingSettingsComponent, {});
    }
}

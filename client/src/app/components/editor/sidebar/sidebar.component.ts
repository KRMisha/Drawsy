import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SidebarButton, sidebarButtons } from '../../../classes/sidebar-button/sidebar-button';
import { tools } from '../../../classes/tools/tools';
import { ToolSelectorService } from '../../../services/drawing/tool-selector/tool-selector.service';
import { Tool } from '../../../services/drawing/tools/tool';
import { GuideComponent } from '../../guide/guide.component';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    buttons: SidebarButton[] = sidebarButtons;
    tools: typeof Tool[] = tools;

    selectedButton: SidebarButton;

    constructor(private toolSelectorService: ToolSelectorService, private dialog: MatDialog) {}

    ngOnInit() {
        this.selectedButton = this.buttons[0];
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
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Button, BUTTONS } from '../../classes/button/button-data';
import { GuideComponent } from '../guide/guide.component';
import { ToolService } from '../../services/tool/tool.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    buttons: Button[] = BUTTONS;

    selectedButton: Button;

    constructor(private toolService: ToolService, private dialog: MatDialog) {}

    ngOnInit() {
        this.selectedButton = this.buttons[0];
    }

    setSelectedTool(toolIndex: number): void {
        if (toolIndex < 0 || toolIndex >= this.buttons.length) {
            return;
        }
        this.selectedButton = this.buttons[toolIndex];
        this.toolService.tool = this.selectedButton.tool;
    }

    openGuideModal(): void {
        this.dialog.open(GuideComponent, {
            width: '1920px',
            height: '1080px',
        });
    }
}

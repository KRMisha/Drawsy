import { Component, OnInit } from '@angular/core';
import { Button, BUTTONS } from '../../classes/button/button-data';
import { ToolService } from '../../services/tool/tool.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    buttons: Button[] = BUTTONS;

    selectedButton: Button;

    constructor(private toolService: ToolService) {}

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
}

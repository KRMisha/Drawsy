import { Component, OnInit } from '@angular/core';
import { Button, BUTTONS } from '../../classes/button/button-data';
import { ToolInputProviderService } from '../../services/tool-input-provider/tool-input-provider.service';

@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
    buttons: Button[] = BUTTONS;

    selectedButton: Button;

    constructor(private toolInputProviderService: ToolInputProviderService) {}

    ngOnInit() {
        this.selectedButton = this.buttons[0];
        this.toolInputProviderService.setTool(this.selectedButton.tool);
    }

    setSelectedTool(toolIndex: number): void {
        if (toolIndex < 0 || toolIndex >= this.buttons.length) {
            return;
        }
        this.selectedButton = this.buttons[toolIndex];
        this.toolInputProviderService.setTool(this.selectedButton.tool);
    }
}

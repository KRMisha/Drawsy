import { Component } from '@angular/core';
import { Button, BUTTONS } from '../../classes/button/button-data';
import { ToolSetting } from 'src/app/classes/tools/tool';

@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
    buttons: Button[] = BUTTONS;

    ToolSetting = ToolSetting; // Make enum available to template

    selectedButton: Button;

    constructor() {
        this.selectedButton = this.buttons[0];
    }

    setSelectedTool(toolIndex: number): void {
        if (toolIndex < 0 || toolIndex >= this.buttons.length) {
            return;
        }
        this.selectedButton = this.buttons[toolIndex];
    }
}

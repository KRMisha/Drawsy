import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tool, ToolSetting} from 'src/app/classes/tools/tool';
import { InputLogger } from 'src/app/classes/tools/input-logger';
import { ToolTest } from 'src/app/classes/tools/tool-test';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    readonly title: string = 'LOG2990';
    message = new BehaviorSubject<string>('');

    ToolSetting = ToolSetting; // Make enum available to template

    availableTools: Tool[] = [
        new InputLogger(),
        new ToolTest()
    ]

    selectedTool: Tool;    

    constructor() {
        this.selectedTool = this.availableTools[0];
    }

    setSelectedTool(toolIndex: number): void {
        if (toolIndex < 0 || toolIndex >= this.availableTools.length) {
            return;
        }
        this.selectedTool = this.availableTools[toolIndex];
    }
}

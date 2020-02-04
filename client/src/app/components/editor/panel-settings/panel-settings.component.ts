import { Component, Input } from '@angular/core';
import { Tool, ToolSettings } from '../../../services/drawing/tools/tool';

@Component({
    selector: 'app-panel-settings',
    templateUrl: './panel-settings.component.html',
    styleUrls: ['./panel-settings.component.scss'],
})
export class PanelSettingsComponent {
    ToolSettings = ToolSettings; // Make enum available to template
    @Input() selectedTool: Tool;
}

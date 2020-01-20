import { Component, Input } from '@angular/core';
import { Tool } from 'src/app/classes/tools/tool';

@Component({
    selector: 'app-panel-settings',
    templateUrl: './panel-settings.component.html',
    styleUrls: ['./panel-settings.component.scss'],
})
export class PanelSettingsComponent {
    @Input() tool: Tool;
}

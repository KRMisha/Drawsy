import { Component, Input } from '@angular/core';
import { Button } from 'src/app/classes/button/button-data';
import { ToolSetting } from '../../classes/tools/tool'

@Component({
    selector: 'app-panel-settings',
    templateUrl: './panel-settings.component.html',
    styleUrls: ['./panel-settings.component.scss'],
})
export class PanelSettingsComponent {
    ToolSetting = ToolSetting; // Make enum available to template
    @Input() selectedButton: Button;
}

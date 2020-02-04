import { Component, Input } from '@angular/core';
import { Button } from 'src/app/classes/button/button-data';
import { ToolSettings } from '../../../classes/tools/tool';

@Component({
    selector: 'app-panel-settings',
    templateUrl: './panel-settings.component.html',
    styleUrls: ['./panel-settings.component.scss'],
})
export class PanelSettingsComponent {
    ToolSettings = ToolSettings; // Make enum available to template
    @Input() selectedButton: Button;
}

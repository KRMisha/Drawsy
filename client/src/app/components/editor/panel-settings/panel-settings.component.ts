import { Component, Input } from '@angular/core';
import { SidebarButton } from '../../../classes/sidebar-button/sidebar-button';
import { ToolHolderService } from '../../../services/drawing/tool-holder/tool-holder.service';
import { ToolSetting } from '../../../services/drawing/tools/tool';

@Component({
    selector: 'app-panel-settings',
    templateUrl: './panel-settings.component.html',
    styleUrls: ['./panel-settings.component.scss'],
})
export class PanelSettingsComponent {
    ToolSetting = ToolSetting; // Make enum available to template
    @Input() selectedButton: SidebarButton;

    constructor(public toolHolderService: ToolHolderService) {}
}

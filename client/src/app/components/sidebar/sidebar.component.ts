import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Button, BUTTONS } from '../../classes/button/button-data';
import { ToolInputProviderService } from '../../services/tool-input-provider/tool-input-provider.service';
import { GuideComponent } from '../guide/guide.component'

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    buttons: Button[] = BUTTONS;

    selectedButton: Button;

    constructor(private toolInputProviderService: ToolInputProviderService,
                private dialog: MatDialog) {}

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

    openGuideModal(): void {
      this.dialog.open(GuideComponent, {
          width: '1920px',
          height: '1080px'
      });
    }

}

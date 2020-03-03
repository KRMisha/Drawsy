import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JunctionSettings } from '@app/editor/classes/junction-settings';
import { ToolDefaults } from '@app/tools/enums/tool-defaults.enum';
import { StrokeTypes, Textures, ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { ToolSelectorService } from '@app/tools/services/tool-selector.service';
import { Subscription } from 'rxjs';

const integerRegexPattern = '^[0-9]*$';
const maximumSize = 500;
const maximumJunctionSize = 500;

@Component({
    selector: 'app-sidebar-drawer',
    templateUrl: './sidebar-drawer.component.html',
    styleUrls: ['./sidebar-drawer.component.scss'],
})
export class SidebarDrawerComponent implements OnInit, OnDestroy {
    // Make enums available to template
    ToolSetting = ToolSetting;
    Textures = Textures;
    StrokeTypes = StrokeTypes;

    sizeSubscription: Subscription;
    junctionSizeSubscription: Subscription;

    sizeGroup = new FormGroup({
        size: new FormControl(
            0,
            Validators.compose([
                Validators.required,
                Validators.max(maximumSize),
                Validators.min(1),
                Validators.pattern(integerRegexPattern),
            ]),
        ),
    });

    junctionSizeGroup = new FormGroup({
        junctionSize: new FormControl(
            0,
            Validators.compose([
                Validators.required,
                Validators.max(maximumJunctionSize),
                Validators.min(1),
                Validators.pattern(integerRegexPattern),
            ]),
        ),
    });

    constructor(private toolSelectorService: ToolSelectorService) {}

    ngOnInit(): void {
        this.sizeGroup.controls.size.setValue(ToolDefaults.Size);
        this.junctionSizeGroup.controls.junctionSize.setValue(ToolDefaults.JunctionSize);

        this.sizeSubscription = this.sizeGroup.controls.size.valueChanges.subscribe(() => {
            if (this.sizeGroup.controls.size.valid) {
                this.toolSelectorService.setSetting(ToolSetting.Size, this.sizeGroup.controls.size.value);
            }
        });

        this.junctionSizeSubscription = this.junctionSizeGroup.controls.junctionSize.valueChanges.subscribe(() => {
            if (this.junctionSizeGroup.controls.junctionSize.valid) {
                this.toolSelectorService.setSetting(ToolSetting.JunctionSettings, {
                    hasJunction: (this.getSetting(ToolSetting.JunctionSettings) as JunctionSettings).hasJunction,
                    junctionSize: this.junctionSizeGroup.controls.junctionSize.value,
                } as JunctionSettings);
            }
        });
    }

    ngOnDestroy(): void {
        this.sizeSubscription.unsubscribe();
        this.junctionSizeSubscription.unsubscribe();
    }

    getToolName(): string {
        return this.toolSelectorService.getToolName();
    }

    getSetting(setting: ToolSetting): number | JunctionSettings | StrokeTypes | Textures {
        return this.toolSelectorService.getSetting(setting);
    }

    setSetting(setting: ToolSetting, value: number | JunctionSettings | StrokeTypes | Textures): void {
        this.toolSelectorService.setSetting(setting, value);
    }

    hasSetting(setting: ToolSetting): boolean {
        return this.toolSelectorService.hasSetting(setting);
    }
}

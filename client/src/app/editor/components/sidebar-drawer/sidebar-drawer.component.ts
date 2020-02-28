import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Color } from '@app/classes/color';
import { ColorService } from '@app/drawing/services/color.service';
import { ToolDefaults } from '@app/tools/enums/tool-defaults.enum';
import { StrokeTypes, Textures, ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { ToolSelectorService } from '@app/tools/services/tool-selector.service';
import { Subscription } from 'rxjs';

const integerRegexPattern = '^[0-9]*$';
const maximumSize = 500;
const maximumJunctionSize = 100;

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

    isPrimarySelected = true;
    isColorPickerDisplayEnabled = false;

    private color = new Color();

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

    constructor(private toolSelectorService: ToolSelectorService, private colorService: ColorService) {
        this.color.red = Color.maxRgb;
        this.color.green = Color.maxRgb;
        this.color.blue = Color.maxRgb;
    }

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
                this.toolSelectorService.setSetting(ToolSetting.HasJunction, [
                    (this.getSetting(ToolSetting.HasJunction) as [boolean, number])[0],
                    this.junctionSizeGroup.controls.junctionSize.value,
                ]);
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

    getSetting(setting: ToolSetting): number | [boolean, number] | StrokeTypes | Textures {
        return this.toolSelectorService.getSetting(setting);
    }

    setSetting(setting: ToolSetting, value: number | [boolean, number] | StrokeTypes | Textures): void {
        this.toolSelectorService.setSetting(setting, value);
    }

    hasSetting(setting: ToolSetting): boolean {
        return this.toolSelectorService.hasSetting(setting);
    }

    getPrimaryColor(): Color {
        return this.colorService.getPrimaryColor();
    }

    getSecondaryColor(): Color {
        return this.colorService.getSecondaryColor();
    }

    selectPrimaryColor(): void {
        this.isPrimarySelected = true;
        this.isColorPickerDisplayEnabled = true;
    }

    selectSecondaryColor(): void {
        this.isPrimarySelected = false;
        this.isColorPickerDisplayEnabled = true;
    }

    updateColor(color: Color): void {
        this.color = color;
    }

    confirmColor(): void {
        if (this.isPrimarySelected) {
            this.colorService.setPrimaryColor(this.color);
        } else {
            this.colorService.setSecondaryColor(this.color);
        }
        this.isColorPickerDisplayEnabled = false;
    }

    swapColors(): void {
        this.colorService.swapPrimaryAndSecondaryColors();
    }

    getSelectedColor(): Color {
        if (this.isPrimarySelected) {
            return this.colorService.getPrimaryColor();
        }
        return this.colorService.getSecondaryColor();
    }

    // get Textures(): string[] {
    //     return Object.values(Textures);
    // }

    // get StrokeTypes(): string[] {
    //     return Object.values(StrokeTypes);
    // }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Color } from '@app/classes/color';
import { ColorService } from '@app/drawing/services/color.service';
import { StrokeTypes, Textures, ToolSetting } from '../../../tools/services/tool';
import { ToolSelectorService } from '../../../tools/services/tool-selector.service';


const integerRegexPattern = '^[0-9]*$';
const maximumSize = 500;
const maximumJunctionSize = 100;

@Component({
    selector: 'app-sidebar-drawer',
    templateUrl: './sidebar-drawer.component.html',
    styleUrls: ['./sidebar-drawer.component.scss'],
})
export class SidebarDrawerComponent implements OnInit{
    // Make enums available to template
    ToolSetting = ToolSetting;
    Textures = Textures;
    StrokeTypes = StrokeTypes;

    isPrimarySelected = true;
    isColorPickerDisplayEnabled = false;

    private color = new Color();

    sizeGroup = new FormGroup({
        drawingSize: new FormControl(
            0, 
            Validators.compose([
                Validators.required, 
                Validators.max(maximumSize), 
                Validators.min(1), 
                Validators.pattern(integerRegexPattern)
            ])
        )
    });
    
    junctionSizeGroup = new FormGroup({
        drawingJunctionSize: new FormControl(
            0, 
            Validators.compose([
                Validators.required, 
                Validators.max(maximumJunctionSize), 
                Validators.min(1), 
                Validators.pattern(integerRegexPattern)
            ])
        )
    });
    

    constructor(private toolSelectorService: ToolSelectorService, private colorService: ColorService) {
        this.color.red = Color.maxRgb;
        this.color.green = Color.maxRgb;
        this.color.blue = Color.maxRgb;

        
        

        this.sizeGroup.controls.drawingSize.valueChanges.subscribe(() => {
            if (this.sizeGroup.controls.drawingSize.valid) {
                this.toolSelectorService.setSetting(ToolSetting.Size, this.sizeGroup.controls.drawingSize.value);
            }
        });

        this.junctionSizeGroup.controls.drawingJunctionSize.valueChanges.subscribe(() => {
            if (this.junctionSizeGroup.controls.drawingJunctionSize.valid) {
                this.toolSelectorService.setSetting(ToolSetting.HasJunction, [true, this.junctionSizeGroup.controls.drawingJunctionSize.value]);
            }
        });
    }

    ngOnInit(): void {
        // We set the initial values now to update the service through the subscribe
        this.sizeGroup.controls.drawingSize.setValue(this.getSetting(ToolSetting.Size));
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
}

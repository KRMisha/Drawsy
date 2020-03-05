import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { JunctionSettings } from '@app/tools/classes/junction-settings';
import { defaultJunctionSize, defaultSize } from '@app/tools/enums/tool-defaults.enum';
import { StrokeType, Texture, ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { ToolSelectorService } from '@app/tools/services/tool-selector.service';
import { Subscription } from 'rxjs';

const integerRegexPattern = '^[0-9]*$';
const maximumSize = 500;
const maximumJunctionSize = 500;
const maximumPolygonSideCount = 12;

@Component({
    selector: 'app-sidebar-drawer',
    templateUrl: './sidebar-drawer.component.html',
    styleUrls: ['./sidebar-drawer.component.scss'],
})
export class SidebarDrawerComponent implements OnInit, OnDestroy {

    // Make enums available to template
    ToolSetting = ToolSetting;
    Texture = Texture;
    StrokeType = StrokeType;

    sizeSubscription: Subscription;
    junctionSizeSubscription: Subscription;
    polygonSideCountSubscription: Subscription;

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
            { value: 0, disabled: true },
            Validators.compose([
                Validators.required,
                Validators.max(maximumJunctionSize),
                Validators.min(1),
                Validators.pattern(integerRegexPattern),
            ]),
        ),
    });

    polygonSideCountGroup = new FormGroup({
        polygonSideCount: new FormControl(
            { value: 0, disabled: false },
            Validators.compose([
                Validators.required,
                Validators.max(maximumPolygonSideCount),
                Validators.min(1),
                Validators.pattern(integerRegexPattern),
            ]),
        ),
    });

    @Input()
    set selectedButtonIndex(index: number) {
        if (this.toolSelectorService.hasSetting(ToolSetting.Size)) {
            this.sizeGroup.controls.size.setValue(this.toolSelectorService.getSetting(ToolSetting.Size));
        }
        if (this.toolSelectorService.hasSetting(ToolSetting.JunctionSettings)) {
            const junctionSize = (this.toolSelectorService.getSetting(ToolSetting.JunctionSettings) as JunctionSettings).junctionSize;
            this.junctionSizeGroup.controls.junctionSize.setValue(junctionSize);
        }
        if (this.toolSelectorService.hasSetting(ToolSetting.PolygonSideCount)) {
            this.polygonSideCountGroup.controls.polygonSideCount.setValue(this.toolSelectorService.getSetting(ToolSetting.PolygonSideCount));
        }
    }

    constructor(private toolSelectorService: ToolSelectorService) {}

    ngOnInit(): void {
        this.sizeGroup.controls.size.setValue(defaultSize);
        this.junctionSizeGroup.controls.junctionSize.setValue(defaultJunctionSize);

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

        this.polygonSideCountSubscription = this.polygonSideCountGroup.controls.polygonSideCount.valueChanges.subscribe(() => {
            if (this.polygonSideCountGroup.controls.polygonSideCount.valid) {
                this.toolSelectorService.setSetting(
                    ToolSetting.PolygonSideCount,
                    this.polygonSideCountGroup.controls.polygonSideCount.value,
                );
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

    getSetting(setting: ToolSetting): number | JunctionSettings | StrokeType | Texture {
        return this.toolSelectorService.getSetting(setting);
    }

    setSetting(setting: ToolSetting, value: number | JunctionSettings | StrokeType | Texture): void {
        if (setting === ToolSetting.JunctionSettings) {
            if ((value as JunctionSettings).hasJunction) {
                this.junctionSizeGroup.controls.junctionSize.enable();
            } else {
                this.junctionSizeGroup.controls.junctionSize.disable();
            }
        }
        this.toolSelectorService.setSetting(setting, value);
    }

    hasSetting(setting: ToolSetting): boolean {
        return this.toolSelectorService.hasSetting(setting);
    }

    protected getJunctionSizeErrorMessage(): string {
        return this.getErrorMessage(this.junctionSizeGroup.controls.junctionSize);
    }

    protected getSizeErrorMessage(): string {
        return this.getErrorMessage(this.sizeGroup.controls.size);
    }

    private getErrorMessage(formControl: AbstractControl): string {
        return formControl.hasError('required')
            ? 'Entrez une taille'
            : formControl.hasError('min')
            ? 'Valeur positive seulement'
            : formControl.hasError('max')
            ? 'Valeur maximale dépassée'
            : formControl.hasError('pattern')
            ? 'Nombre entier invalide'
            : '';
    }
}

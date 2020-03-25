import { Component } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SettingsService } from '@app/modals/services/settings.service';
import { ErrorMessageService } from '@app/services/error-message.service';

@Component({
    selector: 'app-drawing-dimensions-settings',
    templateUrl: './drawing-dimensions-settings.component.html',
    styleUrls: ['./drawing-dimensions-settings.component.scss'],
})
export class DrawingDimensionsSettingsComponent {

    constructor(private settingsService: SettingsService) {}

    getWidthErrorMessage(): string {
        return ErrorMessageService.getErrorMessage(this.widthForm, 'Nombre entier');
    }

    getHeightErrorMessage(): string {
        return ErrorMessageService.getErrorMessage(this.heightForm, 'Nombre entier');
    }

    get widthForm(): AbstractControl {
        return this.settingsService.settingsFormGroup.controls.drawingWidth;
    }

    get heightForm(): AbstractControl {
        return this.settingsService.settingsFormGroup.controls.drawingHeight;
    }

    get formGroup(): FormGroup {
        return this.settingsService.settingsFormGroup;
    }
}

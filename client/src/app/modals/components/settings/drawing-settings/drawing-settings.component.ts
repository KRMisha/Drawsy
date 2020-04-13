import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { SettingsService } from '@app/modals/services/settings.service';
import { Color } from '@app/shared/classes/color';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-drawing-settings',
    templateUrl: './drawing-settings.component.html',
    styleUrls: ['./drawing-settings.component.scss'],
})
export class DrawingSettingsComponent implements OnInit, OnDestroy {
    private widthSubscription: Subscription;
    private heightSubscription: Subscription;

    constructor(private settingsService: SettingsService, private drawingService: DrawingService) {}

    ngOnInit(): void {
        this.widthSubscription = this.formGroup.controls.drawingWidth.valueChanges.subscribe(() => {
            if (this.formGroup.controls.drawingWidth.valid) {
                this.drawingService.dimensions = {
                    x: this.formGroup.controls.drawingWidth.value,
                    y: this.drawingService.dimensions.y,
                };
            }
        });
        this.heightSubscription = this.formGroup.controls.drawingHeight.valueChanges.subscribe(() => {
            if (this.formGroup.controls.drawingHeight.valid) {
                this.drawingService.dimensions = {
                    x: this.drawingService.dimensions.x,
                    y: this.formGroup.controls.drawingHeight.value,
                };
            }
        });
    }

    ngOnDestroy(): void {
        this.widthSubscription.unsubscribe();
        this.heightSubscription.unsubscribe();
    }

    getErrorMessage(formControl: AbstractControl): string {
        return ErrorMessageService.getErrorMessage(formControl, 'Entiers');
    }

    get color(): Color {
        return this.drawingService.backgroundColor;
    }

    set color(color: Color) {
        this.drawingService.backgroundColor = color;
    }

    get formGroup(): FormGroup {
        return this.settingsService.settingsFormGroup;
    }
}

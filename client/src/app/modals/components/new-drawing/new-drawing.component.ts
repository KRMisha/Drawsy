import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import DrawingDimensionsValidation from '@app/drawing/constants/drawing-dimensions-validation';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import Regexes from '@app/shared/constants/regexes';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import { Subscription } from 'rxjs';

const sidebarWidth = 337;

@Component({
    selector: 'app-new-drawing',
    templateUrl: './new-drawing.component.html',
    styleUrls: ['./new-drawing.component.scss'],
})
export class NewDrawingComponent implements OnInit, OnDestroy {
    wereDimensionsModified = false;
    backgroundColor = Color.fromRgb(Color.maxRgb, Color.maxRgb, Color.maxRgb);

    drawingFormGroup = new FormGroup({
        width: new FormControl(window.innerWidth - sidebarWidth, [
            Validators.required,
            Validators.pattern(Regexes.integerRegex),
            Validators.min(DrawingDimensionsValidation.minimumDrawingDimension),
            Validators.max(DrawingDimensionsValidation.maximumDrawingDimension),
        ]),
        height: new FormControl(window.innerHeight, [
            Validators.required,
            Validators.pattern(Regexes.integerRegex),
            Validators.min(DrawingDimensionsValidation.minimumDrawingDimension),
            Validators.max(DrawingDimensionsValidation.maximumDrawingDimension),
        ]),
    });

    private drawingDimensionChangedSubscription: Subscription;

    constructor(private router: Router, private drawingService: DrawingService) {}

    ngOnInit(): void {
        this.drawingDimensionChangedSubscription = this.drawingFormGroup.valueChanges.subscribe(() => {
            this.wereDimensionsModified = true;
        });
    }

    ngOnDestroy(): void {
        this.drawingDimensionChangedSubscription.unsubscribe();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        if (!this.wereDimensionsModified) {
            this.drawingFormGroup.controls.width.setValue((event.target as Window).innerWidth - sidebarWidth, { emitEvent: false });
            this.drawingFormGroup.controls.height.setValue((event.target as Window).innerHeight, { emitEvent: false });
        }
    }

    onSubmit(): void {
        const dimensions = { x: this.drawingFormGroup.controls.width.value, y: this.drawingFormGroup.controls.height.value };
        if (this.drawingFormGroup.invalid && this.drawingService.confirmNewDrawing(dimensions, this.backgroundColor)) {
            this.router.navigate(['/editor']);
        }
    }

    getErrorMessage(formControl: AbstractControl): string {
        return ErrorMessageService.getErrorMessage(formControl, '0-9');
    }
}

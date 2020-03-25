import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Color } from '@app/classes/color';
import Regexes from '@app/constants/regexes';
import DrawingDimensionsValidation from '@app/drawing/constants/drawing-dimensions-validation';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ErrorMessageService } from '@app/services/error-message.service';

const sidebarWidth = 324;

@Component({
    selector: 'app-new-drawing',
    templateUrl: './new-drawing.component.html',
    styleUrls: ['./new-drawing.component.scss'],
})
export class NewDrawingComponent implements OnInit {
    wereDimensionsModified = false;
    backgroundColor = Color.fromRgb(Color.maxRgb, Color.maxRgb, Color.maxRgb);

    drawingFormGroup = new FormGroup({
        width: new FormControl(
            window.innerWidth - sidebarWidth,
            Validators.compose([
                Validators.required,
                Validators.pattern(Regexes.integerRegex),
                Validators.min(DrawingDimensionsValidation.minimumDrawingDimension),
                Validators.max(DrawingDimensionsValidation.maximumDrawingDimension),
            ])
        ),
        height: new FormControl(
            window.innerHeight,
            Validators.compose([
                Validators.required,
                Validators.pattern(Regexes.integerRegex),
                Validators.min(DrawingDimensionsValidation.minimumDrawingDimension),
                Validators.max(DrawingDimensionsValidation.maximumDrawingDimension),
            ])
        ),
    });

    constructor(private router: Router, private drawingService: DrawingService) {}

    ngOnInit(): void {
        this.drawingFormGroup.controls.width.valueChanges.subscribe(() => {
            this.wereDimensionsModified = true;
        });
        this.drawingFormGroup.controls.height.valueChanges.subscribe(() => {
            this.wereDimensionsModified = true;
        });
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
        if (this.drawingService.confirmNewDrawing(dimensions, this.backgroundColor)) {
            this.router.navigate(['/editor']);
        }
    }

    getWidthErrorMessage(): string {
        return ErrorMessageService.getErrorMessage(this.drawingFormGroup.controls.width, 'Nombre entier');
    }

    getHeightErrorMessage(): string {
        return ErrorMessageService.getErrorMessage(this.drawingFormGroup.controls.height, 'Nombre entier');
    }
}

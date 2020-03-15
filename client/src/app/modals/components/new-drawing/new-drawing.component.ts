import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Color } from '@app/classes/color';
import { DrawingService } from '@app/drawing/services/drawing.service';

const widthMargin = 324;
const maximumDimension = 10000;
const integerRegexPattern = '^[0-9]*$';

@Component({
    selector: 'app-new-drawing',
    templateUrl: './new-drawing.component.html',
    styleUrls: ['./new-drawing.component.scss'],
})
export class NewDrawingComponent implements OnInit {
    wereDimensionsModified = false;
    backgroundColor = Color.fromRgb(Color.maxRgb, Color.maxRgb, Color.maxRgb);

    drawingGroup = new FormGroup({
        width: new FormControl(
            window.innerWidth - widthMargin,
            Validators.compose([
                Validators.required,
                Validators.min(1),
                Validators.max(maximumDimension),
                Validators.pattern(integerRegexPattern),
            ]),
        ),
        height: new FormControl(
            window.innerHeight,
            Validators.compose([
                Validators.required,
                Validators.min(1),
                Validators.max(maximumDimension),
                Validators.pattern(integerRegexPattern),
            ]),
        ),
    });

    constructor(private router: Router, private drawingService: DrawingService) {}

    ngOnInit(): void {
        this.drawingGroup.controls.width.valueChanges.subscribe(() => {
            this.wereDimensionsModified = true;
        });
        this.drawingGroup.controls.height.valueChanges.subscribe(() => {
            this.wereDimensionsModified = true;
        });
    }

    onSubmit(): void {
        const dimensions = { x: this.drawingGroup.controls.width.value, y: this.drawingGroup.controls.height.value };
        if (this.drawingService.confirmNewDrawing(dimensions, this.backgroundColor)) {
            this.drawingService.id = undefined;
            this.drawingService.title = '';
            this.drawingService.labels = [];
            this.router.navigate(['/editor']);
        }
    }

    getWidthErrorMessage(): string {
        return this.getErrorMessage(this.drawingGroup.controls.width);
    }

    getHeightErrorMessage(): string {
        return this.getErrorMessage(this.drawingGroup.controls.height);
    }

    private getErrorMessage(formControl: AbstractControl): string {
        return formControl.hasError('required')
            ? 'Entrez une valeur'
            : formControl.hasError('min')
            ? 'Valeur négative ou nulle invalide'
            : formControl.hasError('max')
            ? 'Valeur maximale de 10000 px'
            : formControl.hasError('pattern')
            ? 'Nombre entier invalide'
            : '';
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        if (!this.wereDimensionsModified) {
            this.drawingGroup.controls.width.setValue((event.target as Window).innerWidth - widthMargin, { emitEvent: false });
            this.drawingGroup.controls.height.setValue((event.target as Window).innerHeight, { emitEvent: false });
        }
    }
}

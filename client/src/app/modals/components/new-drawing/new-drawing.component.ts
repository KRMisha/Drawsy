import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Color } from '@app/classes/color';
import { DrawingService } from '@app/drawing/services/drawing.service';

const widthMargin = 348;
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

    drawingFormGroup = new FormGroup({
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
        this.drawingFormGroup.controls.width.valueChanges.subscribe(() => {
            this.wereDimensionsModified = true;
        });
        this.drawingFormGroup.controls.height.valueChanges.subscribe(() => {
            this.wereDimensionsModified = true;
        });
    }

    onSubmit(): void {
        const confirmationMessage =
            'Attention! Un dessin non-vide est déjà présent sur la zone de travail. ' +
            'Désirez-vous continuer et abandonner vos changements?';
        if (this.drawingService.isDrawingStarted() && !confirm(confirmationMessage)) {
            return;
        }

        this.drawingService.dimensions = { x: this.drawingFormGroup.controls.width.value, y: this.drawingFormGroup.controls.height.value };
        this.drawingService.backgroundColor = this.backgroundColor;
        this.drawingService.clearStoredElements();
        this.router.navigate(['/editor']);
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

    protected getWidthErrorMessage(): string {
        return this.getErrorMessage(this.drawingFormGroup.controls.width);
    }

    protected getHeightErrorMessage(): string {
        return this.getErrorMessage(this.drawingFormGroup.controls.height);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        if (!this.wereDimensionsModified) {
            this.drawingFormGroup.controls.width.setValue((event.target as Window).innerWidth - widthMargin, { emitEvent: false });
            this.drawingFormGroup.controls.height.setValue((event.target as Window).innerHeight, { emitEvent: false });
        }
    }
}

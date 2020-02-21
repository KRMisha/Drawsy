import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Color } from '../../classes/color/color';
import { DrawingService } from '../../services/drawing/drawing.service';

const widthMargin = 348;
const heightMargin = 4;
const maximumHeightWidth = 10000;

@Component({
    selector: 'app-create-drawing',
    templateUrl: './create-drawing.component.html',
    styleUrls: ['./create-drawing.component.scss'],
})
export class CreateDrawingComponent implements OnInit {
    wereDimensionsModified = false;
    backgroundColor = new Color();

    drawingForm = new FormGroup({
        width: new FormControl(
            window.innerWidth - widthMargin,
            Validators.compose([Validators.required, Validators.min(1), Validators.max(maximumHeightWidth)]),
        ),
        height: new FormControl(
            window.innerHeight - heightMargin,
            Validators.compose([Validators.required, Validators.min(1), Validators.max(maximumHeightWidth)]),
        ),
    });

    constructor(private router: Router, private drawingService: DrawingService) {
        this.backgroundColor.red = 255;
        this.backgroundColor.green = 255;
        this.backgroundColor.blue = 255;
    }

    ngOnInit() {
        this.drawingForm.controls.width.valueChanges.subscribe(() => {
            this.wereDimensionsModified = true;
        });
        this.drawingForm.controls.height.valueChanges.subscribe(() => {
            this.wereDimensionsModified = true;
        });
    }

    onSubmit() {
        const confirmationMessage =
            'Attention! Un dessin non-vide est déjà présent sur la zone de travail. ' +
            'Désirez-vous continuer et abandonner vos changements?';
        if (this.drawingService.isDrawingStarted && !confirm(confirmationMessage)) {
            return;
        }

        this.drawingService.drawingDimensions = { x: this.drawingForm.controls.width.value, y: this.drawingForm.controls.height.value };
        this.drawingService.backgroundColor = this.backgroundColor;
        this.drawingService.clearStoredElements();
        this.router.navigate(['/editor']);
    }

    private getErrorMessage(formControl: AbstractControl) {
        return formControl.hasError('required') ? 'Entrez une valeur' :
            formControl.hasError('min') ? 'Valeur négative ou nulle invalide' :
            formControl.hasError('max') ? 'Valeur maximale de 10000 px' :
                '';
    }

    protected getWidthErrorMessage() {
        return this.getErrorMessage(this.drawingForm.controls.width);
    }

    protected getHeightErrorMessage() {
        return this.getErrorMessage(this.drawingForm.controls.height);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        if (!this.wereDimensionsModified) {
            this.drawingForm.controls.width.setValue((event.target as Window).innerWidth - widthMargin, { emitEvent: false });
            this.drawingForm.controls.height.setValue((event.target as Window).innerHeight - heightMargin, { emitEvent: false });
        }
    }
}

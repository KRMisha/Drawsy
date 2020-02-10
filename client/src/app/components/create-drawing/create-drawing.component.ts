import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Color } from '../../classes/color/color';
import { DrawingService } from '../../services/drawing/drawing.service';

const widthMargin = 348;
const heightMargin = 4;

@Component({
    selector: 'app-create-drawing',
    templateUrl: './create-drawing.component.html',
    styleUrls: ['./create-drawing.component.scss'],
})
export class CreateDrawingComponent implements OnInit {
    windowWidth: number;
    windowHeight: number;
    backgroundColor: Color = new Color();

    drawingForm = new FormGroup({
        width: new FormControl(0, Validators.compose([Validators.required, Validators.min(1), Validators.max(10000)])),
        height: new FormControl(0, Validators.compose([Validators.required, Validators.min(1), Validators.max(10000)])),
    });

    constructor(private router: Router, private drawingService: DrawingService) {}

    ngOnInit() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.drawingForm.controls.width.setValue(window.innerWidth - widthMargin);
        this.drawingForm.controls.height.setValue(window.innerHeight - heightMargin);
        this.backgroundColor.red = 255;
        this.backgroundColor.green = 255;
        this.backgroundColor.blue = 255;
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

    updateColor(color: Color) {
        this.backgroundColor = color;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        const isWidthMatching = this.drawingForm.controls.width.value === this.windowWidth - widthMargin;
        const isHeightMatching = this.drawingForm.controls.height.value === this.windowHeight - heightMargin;
        if (isWidthMatching && isHeightMatching) {
            this.drawingForm.controls.width.setValue((event.target as Window).innerWidth - widthMargin);
            this.drawingForm.controls.height.setValue((event.target as Window).innerHeight - heightMargin);
        }
        this.windowWidth = (event.target as Window).innerWidth;
        this.windowHeight = (event.target as Window).innerHeight;
    }
}

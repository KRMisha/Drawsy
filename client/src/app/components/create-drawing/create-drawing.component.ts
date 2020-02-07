import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateDrawingService } from 'src/app/services/create-drawing/create-drawing.service';
import { Color } from 'src/app/classes/color/color';

@Component({
    selector: 'app-create-drawing',
    templateUrl: './create-drawing.component.html',
    styleUrls: ['./create-drawing.component.scss'],
})
export class CreateDrawingComponent implements OnInit {
    windowWidth: number;
    windowHeight: number;
    formWidth: number;
    formHeight: number;

    drawingForm = new FormGroup({
        height: new FormControl(this.formHeight, Validators.compose([Validators.required, Validators.min(0), Validators.max(10000)])),
        width: new FormControl(this.formWidth, Validators.compose([Validators.required, Validators.min(0), Validators.max(10000)])),
    });

    constructor(public dialogRef: MatDialogRef<CreateDrawingComponent>, private drawingService: CreateDrawingService) {}

    ngOnInit() {
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
        this.formWidth = this.windowWidth;
        this.formHeight = this.windowHeight;
    }

    onSubmit() {
        this.drawingService.changeHeight(this.drawingForm.controls.height.value);
        this.drawingService.changeWidth(this.drawingForm.controls.width.value);
        this.onClose();
    }

    onClose() {
        this.dialogRef.close();
    }

    updateColor(color: Color) {
        console.log(color);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        if (this.formWidth === this.windowWidth) {
            this.formWidth = (event.target as Window).innerWidth;
        }
        if (this.formHeight === this.windowHeight) {
            this.formHeight = (event.target as Window).innerHeight;
        }
        this.windowWidth = (event.target as Window).innerWidth;
        this.windowHeight = (event.target as Window).innerHeight;
    }
}

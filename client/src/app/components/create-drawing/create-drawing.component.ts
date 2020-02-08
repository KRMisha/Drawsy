import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Color } from 'src/app/classes/color/color';
import { CreateDrawingService } from 'src/app/services/create-drawing/create-drawing.service';

@Component({
    selector: 'app-create-drawing',
    templateUrl: './create-drawing.component.html',
    styleUrls: ['./create-drawing.component.scss'],
})
export class CreateDrawingComponent implements OnInit {
    windowWidth: number;
    windowHeight: number;
    backgroundColor: Color;

    drawingForm = new FormGroup({
        height: new FormControl(0, Validators.compose([Validators.required, Validators.min(0), Validators.max(10000)])),
        width: new FormControl(0, Validators.compose([Validators.required, Validators.min(0), Validators.max(10000)])),
    });

    constructor(public dialogRef: MatDialogRef<CreateDrawingComponent>, private drawingService: CreateDrawingService) {}

    ngOnInit() {
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
        this.drawingForm.controls.width.setValue(this.subtractSidebarWidth(this.windowWidth));
        this.drawingForm.controls.height.setValue(this.windowHeight);
        this.backgroundColor.red = 255;
        this.backgroundColor.green = 255;
        this.backgroundColor.blue = 255;
    }

    onSubmit() {
        this.drawingService.changeHeight(this.drawingForm.controls.height.value);
        this.drawingService.changeWidth(this.drawingForm.controls.width.value);
        this.drawingService.changeColor(this.backgroundColor);
        this.onClose();
    }

    onClose() {
        this.dialogRef.close();
    }

    updateColor(color: Color) {
        this.backgroundColor = color;
    }

    private subtractSidebarWidth(totalWidth: number): number {
        const sidebarWidth = 68;
        const toolSettingWidth = 278;
        return totalWidth - sidebarWidth - toolSettingWidth;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        const matchingWidth: boolean = this.drawingForm.controls.width.value === this.subtractSidebarWidth(this.windowWidth);
        const matchingHeight: boolean = this.drawingForm.controls.height.value === this.windowHeight;
        if (matchingWidth && matchingHeight) {
            this.drawingForm.controls.width.setValue(this.subtractSidebarWidth((event.target as Window).innerWidth));
            this.drawingForm.controls.height.setValue((event.target as Window).innerHeight);
        }
        this.windowWidth = (event.target as Window).innerWidth;
        this.windowHeight = (event.target as Window).innerHeight;
    }
}

import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Color } from 'src/app/classes/color/color';
import { DrawingService } from '../../services/drawing/drawing.service';

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
    backgroundColor: Color;

    drawingForm = new FormGroup({
        width: new FormControl(this.formWidth, Validators.compose([Validators.required, Validators.min(0), Validators.max(10000)])),
        height: new FormControl(this.formHeight, Validators.compose([Validators.required, Validators.min(0), Validators.max(10000)])),
    });

    constructor(private dialogRef: MatDialogRef<CreateDrawingComponent>, private drawingService: DrawingService) {}

    ngOnInit() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.formWidth = this.windowWidth;
        this.formHeight = this.windowHeight;
    }

    onSubmit() {
        this.drawingService.clearStoredElements();
        this.drawingService.drawingDimensions = { x: this.drawingForm.controls.width.value, y: this.drawingForm.controls.height.value };
        this.onClose();
    }

    onClose() {
        this.dialogRef.close();
    }

    updateColor(color: Color) {
        this.backgroundColor = color;
    }

    updateWidth() {
        this.formWidth = this.drawingForm.controls.width.value;
    }

    updateHeight() {
        this.formHeight = this.drawingForm.controls.height.value;
    }

    private substractSidebarWidth(totalWidth: number): number {
        const sidebarWidth = 68;
        const toolSettingWidth = 278;
        return totalWidth - sidebarWidth - toolSettingWidth;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        if (this.formWidth === this.subtractSidebarWidth(this.windowWidth)) {
            this.formWidth = this.subtractSidebarWidth((event.target as Window).innerWidth);
            console.log('hello');
        }
        if (this.formHeight === this.windowHeight) {
            this.formHeight = (event.target as Window).innerHeight;
        }
        this.windowWidth = (event.target as Window).innerWidth;
        this.windowHeight = (event.target as Window).innerHeight;
    }

    private subtractSidebarWidth(totalWidth: number): number {
        const sidebarWidth = 68;
        const toolSettingWidth = 278;
        return totalWidth - sidebarWidth - toolSettingWidth;
    }
}

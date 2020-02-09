import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Color } from '../../classes/color/color';
import { DrawingService } from '../../services/drawing/drawing.service';

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
        width: new FormControl(0, Validators.compose([Validators.required, Validators.min(0), Validators.max(10000)])),
        height: new FormControl(0, Validators.compose([Validators.required, Validators.min(0), Validators.max(10000)])),
    });

    constructor(private router: Router, private drawingService: DrawingService) {}

    ngOnInit() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.drawingForm.controls.width.setValue(this.subtractSidebarWidth(window.innerWidth));
        this.drawingForm.controls.height.setValue(window.innerHeight);
        this.backgroundColor.red = 255;
        this.backgroundColor.green = 255;
        this.backgroundColor.blue = 255;
    }

    onSubmit() {
        this.drawingService.drawingDimensions = { x: this.drawingForm.controls.width.value, y: this.drawingForm.controls.height.value };
        this.drawingService.backgroundColor = this.backgroundColor;
        this.drawingService.clearStoredElements();
        this.router.navigate(['/editor']);
    }

    updateColor(color: Color) {
        this.backgroundColor = color;
    }

    private subtractSidebarWidth(totalWidth: number): number {
        const sidebarWidth = 70;
        const toolSettingWidth = 290;
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

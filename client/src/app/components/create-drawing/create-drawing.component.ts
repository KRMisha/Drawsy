import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog'
import { CreateDrawingService } from 'src/app/services/create-drawing/create-drawing.service';
import { VirtualTimeScheduler } from 'rxjs';

@Component({
    selector: 'app-create-drawing',
    templateUrl: './create-drawing.component.html',
    styleUrls: ['./create-drawing.component.scss'],
})
export class CreateDrawingComponent implements OnInit{
    windowWidth: number;
    windowHeight: number;
    formWidth: number;
    formHeight: number;

    drawingForm = new FormGroup({
        height: new FormControl(this.formHeight, Validators.compose([Validators.required, Validators.min(0), Validators.max(10000)])),
        width: new FormControl(this.formWidth, Validators.compose([Validators.required, Validators.min(0), Validators.max(10000)])),
    })

    constructor(
        public dialogRef: MatDialogRef<CreateDrawingComponent>,
        private drawingService: CreateDrawingService,
        ) {}

    ngOnInit() {
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
        this.formWidth = this.windowWidth;
        this.formHeight = this.windowHeight;
    }

    onSubmit() {
        this.drawingService.changeHeight(this.drawingForm.controls['height'].value);
        this.drawingService.changeWidth(this.drawingForm.controls['width'].value);
        // send the color
        this.onClose();
    }

    onClose() {
        this.dialogRef.close();
    }

    onResize(event: object) {
        if(this.formWidth === this.windowWidth) {
            this.formWidth = event.target.innerWidth;
        }
        if(this.formHeight === this.windowHeight) {
            this.formHeight = event.target.innerHeight;
        }
        this.windowWidth = event.target.innerWidth;
        this.windowHeight = event.target.innerHeight;

        
    }
}

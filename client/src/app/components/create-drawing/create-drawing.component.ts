import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog'
import { CreateDrawingService } from 'src/app/services/create-drawing/create-drawing.service';

@Component({
    selector: 'app-create-drawing',
    templateUrl: './create-drawing.component.html',
    styleUrls: ['./create-drawing.component.scss'],
})
export class CreateDrawingComponent {

    drawingForm = new FormGroup({
        height: new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(10000)])),
        width: new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(10000)])),
    })

    constructor(
        public dialogRef: MatDialogRef<CreateDrawingComponent>,
        private drawingService: CreateDrawingService,
        ) {}

    onSubmit() {
        this.drawingService.changeHeight(this.drawingForm.controls['height'].value);
        this.drawingService.changeWidth(this.drawingForm.controls['width'].value);
        // send the color
        this.onClose();
    }

    onClose() {
        this.dialogRef.close();
    }
}

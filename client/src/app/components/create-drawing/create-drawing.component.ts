import { Component } from '@angular/core';
<<<<<<< Updated upstream
import { MatDialogRef } from '@angular/material/dialog';
import { Color } from '../../classes/color/color';
import { ColorService } from '../../services/color/color.service';
import { CreateDrawingService } from '../../services/create-drawing/data-sharer/create-drawing.service';
=======
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateDrawingService } from 'src/app/services/create-drawing/create-drawing.service';
>>>>>>> Stashed changes

@Component({
    selector: 'app-create-drawing',
    templateUrl: './create-drawing.component.html',
    styleUrls: ['./create-drawing.component.scss'],
})
export class CreateDrawingComponent {

<<<<<<< Updated upstream
    constructor(
        public dialogRef: MatDialogRef<CreateDrawingComponent>,
        private drawingService: CreateDrawingService,
        private colorService: ColorService,
    ) {
        // this.drawingService.changeColor(new Color(255, 255, 255, 1));
        this.drawingService.changeHeight(0); // TODO: set to window size
        this.drawingService.changeWidth(0); // TODO: set to window size

        drawingService.width$.subscribe(width => (this.drawingWidth = width));
        drawingService.height$.subscribe(height => (this.drawingHeight = height));
        // drawingService.color$.subscribe(color => (this.drawingColor = color));
    }

    close(): void {
        this.dialogRef.close();
    }
=======
    drawingForm = new FormGroup({
        height: new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(10000)]) ),
        width: new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(10000)])),
    })

    constructor(private drawingService: CreateDrawingService) {}
>>>>>>> Stashed changes

    onSubmit() {
        //this.drawingService.changeHeight(this.drawingForm.);
    }

    onClose() {

    }
}

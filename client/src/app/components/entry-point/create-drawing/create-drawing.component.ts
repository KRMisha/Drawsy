import { Component, OnInit } from '@angular/core';
import { Color } from '../../../classes/color'

@Component({
  selector: 'app-create-drawing',
  templateUrl: './create-drawing.component.html',
  styleUrls: ['./create-drawing.component.scss']
})

export class CreateDrawingComponent implements OnInit {
  drawingWidth: number;
  drawingHeigth: number;
  drawingColor: Color;

  constructor() { }

  ngOnInit() {
    // this.drawingColor.b = Color(255,255,255);
    this.drawingHeigth = 0; // TODO: fit to window size
    this.drawingWidth = 0; // TODO: fit to window size
  }

}

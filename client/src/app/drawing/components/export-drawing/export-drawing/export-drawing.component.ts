import { Component, OnInit } from '@angular/core';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-export-drawing',
  templateUrl: './export-drawing.component.html',
  styleUrls: ['./export-drawing.component.scss']
})
export class ExportDrawingComponent implements OnInit {

  fileUrl: SafeUrl;
  constructor(private drawingSerializerService: DrawingSerializerService) { }
  ngOnInit() {
    this.exportDrawing();
  }

  exportDrawing(): void {
    this.fileUrl = this.drawingSerializerService.exportCurrentDrawing();
  }
}

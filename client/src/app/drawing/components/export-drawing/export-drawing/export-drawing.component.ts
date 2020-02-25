import { Component, OnInit } from '@angular/core';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { SafeUrl, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-export-drawing',
  templateUrl: './export-drawing.component.html',
  styleUrls: ['./export-drawing.component.scss']
})
export class ExportDrawingComponent implements OnInit {

  fileUrl: SafeUrl;
  constructor(private drawingSerializerService: DrawingSerializerService, private meta:Meta) {

  }
  ngOnInit() {
  }

  exportDrawing(): void {
    const metaArray: HTMLMetaElement[] = [];
    const nextMetaElement = this.meta.addTag({ name: 'Sam', content: 'samsam'});
    if (nextMetaElement instanceof HTMLMetaElement) {
      metaArray.push(nextMetaElement);
    }
    this.fileUrl = this.drawingSerializerService.exportCurrentDrawing(metaArray);
  }
}

import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Tool } from '../../classes/tools/tool'
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
  providedIn: 'root'
})
export class ToolInputProviderService {

  tool: Tool;

  drawingSurface = document.body;

  constructor(private drawingService: DrawingService) {

  }

  mouseMoveSubscription = fromEvent(this.drawingSurface, 'mousemove').subscribe((event: MouseEvent) => {
      this.tool.onMouseMove(event, this.drawingService);
  });

  mouseDownSubscription = fromEvent(this.drawingSurface, 'mousedown').subscribe((event: MouseEvent) => {
      this.tool.onMouseDown(event, this.drawingService);
  });

  mouseUpSubscription = fromEvent(this.drawingSurface, 'mouseup').subscribe((event: MouseEvent) => {
      this.tool.onMouseUp(event, this.drawingService);
  });

  keyDownSubscription = fromEvent(this.drawingSurface, 'keydown')
      .pipe(distinctUntilChanged()) // Avoid key repeats
      .subscribe((event: KeyboardEvent) => {
          this.tool.onKeyDown(event, this.drawingService);
      });

  keyUpSubscription = fromEvent(this.drawingSurface, 'keyup')
      .pipe(distinctUntilChanged()) // Avoid key repeats
      .subscribe((event: KeyboardEvent) => {
          this.tool.onKeyUp(event, this.drawingService);
      });

  setTool(tool: Tool): void {
    this.tool = tool;
  }

}

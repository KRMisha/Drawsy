import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { InputLogger } from '../../classes/tools/input-logger'
import { Tool } from '../../classes/tools/tool'

@Injectable({
  providedIn: 'root'
})
export class ToolInputProviderService {

  tool: Tool = new InputLogger();

  drawingSurface = document.body;

    mouseMoveSubscription = fromEvent(this.drawingSurface, 'mousemove').subscribe((event: MouseEvent) => {
        this.tool.onMouseMove(event.clientX, event.clientY);
    });

    mouseDownSubscription = fromEvent(this.drawingSurface, 'mousedown').subscribe((event: MouseEvent) => {
        this.tool.onMouseDown(event.clientX, event.clientY, event.button);
    });

    mouseUpSubscription = fromEvent(this.drawingSurface, 'mouseup').subscribe((event: MouseEvent) => {
        this.tool.onMouseUp(event.clientX, event.clientY, event.button);
    });

    keyDownSubscription = fromEvent(this.drawingSurface, 'keydown')
        .pipe(distinctUntilChanged()) // Avoid key repeats
        .subscribe((event: KeyboardEvent) => {
            this.tool.onKeyDown(event.key);
        });

    keyUpSubscription = fromEvent(this.drawingSurface, 'keyup')
        .pipe(distinctUntilChanged()) // Avoid key repeats
        .subscribe((event: KeyboardEvent) => {
            this.tool.onKeyUp(event.key);
        });

  setTool(tool: Tool): void {
    this.tool = tool;
  }

}

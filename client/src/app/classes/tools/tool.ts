import { fromEvent } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators'

export abstract class Tool {
    drawingSurface = document.body;

    mouseMoveSubscription = fromEvent(this.drawingSurface, 'mousemove')
        .subscribe((event: MouseEvent) => {
            this.onMouseMove(event.clientX, event.clientY);
        });

    mouseDownSubscription = fromEvent(this.drawingSurface, 'mousedown')
        .subscribe((event: MouseEvent) => {
            this.onMouseDown(event.clientX, event.clientY, event.button);
        });

    mouseUpSubscription = fromEvent(this.drawingSurface, 'mouseup')
        .subscribe((event: MouseEvent) => {
            this.onMouseUp(event.clientX, event.clientY, event.button);
        });

    keyDownSubscription = fromEvent(this.drawingSurface, 'keydown')
        .pipe(distinctUntilChanged()) // Avoid key repeats
        .subscribe((event: KeyboardEvent) => {
            this.onKeyDown(event.key);
        })

    keyUpSubscription = fromEvent(this.drawingSurface, 'keyup')
        .pipe(distinctUntilChanged()) // Avoid key repeats
        .subscribe((event: KeyboardEvent) => {
            this.onKeyUp(event.key);
        })

    abstract onMouseMove(x: number, y: number): void;
    abstract onMouseDown(x: number, y: number, button: number): void;
    abstract onMouseUp(x: number, y: number, button: number): void;
    abstract onKeyDown(key: string): void;
    abstract onKeyUp(key: string): void;
}

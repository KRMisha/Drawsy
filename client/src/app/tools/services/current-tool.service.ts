import { Injectable, OnDestroy } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { SvgClickEvent } from '@app/shared/classes/svg-click-event';
import { Vec2 } from '@app/shared/classes/vec2';
import { Tool } from '@app/tools/services/tool';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CurrentToolService implements OnDestroy {
    private _currentTool: Tool; // tslint:disable-line: variable-name

    private primaryColorChangedSubscription: Subscription;
    private secondaryColorChangedSubscription: Subscription;
    private elementClickedSubscription: Subscription;

    constructor(private colorService: ColorService, private drawingService: DrawingService) {
        this.primaryColorChangedSubscription = this.colorService.primaryColorChanged$.subscribe((color: Color) => {
            this.currentTool.onPrimaryColorChange(color);
        });

        this.secondaryColorChangedSubscription = this.colorService.secondaryColorChanged$.subscribe((color: Color) => {
            this.currentTool.onSecondaryColorChange(color);
        });

        this.elementClickedSubscription = this.drawingService.elementClicked$.subscribe((svgClickEvent: SvgClickEvent) => {
            this.currentTool.onElementClick(svgClickEvent.mouseEvent, svgClickEvent.element);
        });
    }

    ngOnDestroy(): void {
        this.primaryColorChangedSubscription.unsubscribe();
        this.secondaryColorChangedSubscription.unsubscribe();
        this.elementClickedSubscription.unsubscribe();
    }

    onMouseMove(event: MouseEvent): void {
        Tool.mousePosition = this.getMousePosition(event);
        this.currentTool.onMouseMove(event);
    }

    onMouseDown(event: MouseEvent): void {
        Tool.mousePosition = this.getMousePosition(event);
        this.currentTool.onMouseDown(event);
    }

    onMouseUp(event: MouseEvent): void {
        this.currentTool.onMouseUp(event);
    }

    onMouseDoubleClick(event: MouseEvent): void {
        this.currentTool.onMouseDoubleClick(event);
    }

    onKeyDown(event: KeyboardEvent): void {
        this.currentTool.onKeyDown(event);
    }

    onKeyUp(event: KeyboardEvent): void {
        this.currentTool.onKeyUp(event);
    }

    onEnter(event: MouseEvent): void {
        this.currentTool.onEnter(event);
    }

    onLeave(event: MouseEvent): void {
        this.currentTool.onLeave(event);
    }

    setLeftMouseButtonDown(isLeftMouseButtonDown: boolean): void {
        Tool.isLeftMouseButtonDown = isLeftMouseButtonDown;
    }

    setMouseInsideDrawing(isMouseInsideDrawing: boolean): void {
        Tool.isMouseInsideDrawing = isMouseInsideDrawing;
    }

    updateSelectedTool(): void {
        this.currentTool.update();
    }

    get currentTool(): Tool {
        return this._currentTool;
    }

    set currentTool(tool: Tool) {
        if (this.currentTool !== undefined) {
            this.currentTool.onToolDeselection();
        }

        this._currentTool = tool;
        this._currentTool.onToolSelection();
    }

    private getMousePosition(event: MouseEvent): Vec2 {
        const rootBounds = this.drawingService.drawingRoot.getBoundingClientRect() as DOMRect;
        return {
            x: event.clientX - rootBounds.x,
            y: event.clientY - rootBounds.y,
        } as Vec2;
    }
}

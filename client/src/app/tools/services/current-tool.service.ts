import { Injectable, OnDestroy } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { SvgClickEvent } from '@app/shared/classes/svg-click-event';
import { Tool } from '@app/tools/services/tool';
import { ToolHolderService } from '@app/tools/services/tool-holder.service';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CurrentToolService implements OnDestroy {
    private _currentTool: Tool; // tslint:disable-line: variable-name

    private primaryColorChangedSubscription: Subscription;
    private secondaryColorChangedSubscription: Subscription;
    private elementClickedSubscription: Subscription;

    constructor(private toolHolderService: ToolHolderService, private colorService: ColorService, private drawingService: DrawingService) {
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

    afterDrawingInit(): void {
        for (const tool of this.toolHolderService.tools) {
            tool.afterDrawingInit();
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.currentTool.onMouseMove(event);
    }

    onMouseDown(event: MouseEvent): void {
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

    get currentTool(): Tool {
        return this._currentTool;
    }

    set currentTool(tool: Tool) {
        if (this.currentTool !== undefined) {
            this.currentTool.onToolDeselection();
        }

        this._currentTool = tool;
    }
}

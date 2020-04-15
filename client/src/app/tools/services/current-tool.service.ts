import { Injectable, OnDestroy } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { Tool } from '@app/tools/services/tool';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CurrentToolService implements OnDestroy {
    private _currentTool: Tool; // tslint:disable-line: variable-name

    private primaryColorChangedSubscription: Subscription;
    private secondaryColorChangedSubscription: Subscription;
    private historyChangedSubscription: Subscription;
    private drawingLoadedSubscription: Subscription;

    constructor(private colorService: ColorService, private drawingService: DrawingService, private historyService: HistoryService) {
        this.primaryColorChangedSubscription = this.colorService.primaryColorChanged$.subscribe((color: Color) => {
            this.currentTool.onPrimaryColorChange(color);
        });
        this.secondaryColorChangedSubscription = this.colorService.secondaryColorChanged$.subscribe((color: Color) => {
            this.currentTool.onSecondaryColorChange(color);
        });
        this.historyChangedSubscription = this.historyService.drawingHistoryChanged$.subscribe(() => {
            this.currentTool.onHistoryChange();
        });
        this.drawingLoadedSubscription = this.drawingService.drawingLoaded$.subscribe(() => {
            this.currentTool.onDrawingLoad();
        });
    }

    ngOnDestroy(): void {
        this.primaryColorChangedSubscription.unsubscribe();
        this.secondaryColorChangedSubscription.unsubscribe();
        this.historyChangedSubscription.unsubscribe();
        this.drawingLoadedSubscription.unsubscribe();
    }

    onMouseMove(event: MouseEvent): void {
        Tool.mousePosition = this.getMousePosition(event);
        this.currentTool.onMouseMove(event);
    }

    onMouseDown(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            Tool.isLeftMouseButtonDown = true;
        }

        Tool.mousePosition = this.getMousePosition(event);
        this.currentTool.onMouseDown(event);
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            Tool.isLeftMouseButtonDown = false;
        }

        Tool.mousePosition = this.getMousePosition(event);
        this.currentTool.onMouseUp(event);
    }

    onScroll(event: WheelEvent): void {
        this.currentTool.onScroll(event);
    }

    onMouseDoubleClick(event: MouseEvent): void {
        Tool.mousePosition = this.getMousePosition(event);
        this.currentTool.onMouseDoubleClick(event);
    }

    onKeyDown(event: KeyboardEvent): void {
        this.currentTool.onKeyDown(event);
    }

    onKeyUp(event: KeyboardEvent): void {
        this.currentTool.onKeyUp(event);
    }

    onMouseEnter(event: MouseEvent): void {
        Tool.isMouseInsideDrawing = true;
        Tool.mousePosition = this.getMousePosition(event);
        this.currentTool.onMouseEnter(event);
    }

    onMouseLeave(event: MouseEvent): void {
        Tool.isMouseInsideDrawing = false;
        Tool.mousePosition = this.getMousePosition(event);
        this.currentTool.onMouseLeave(event);
    }

    onFocusIn(event: FocusEvent): void {
        this.currentTool.onFocusIn(event);
    }

    onFocusOut(event: FocusEvent): void {
        this.currentTool.onFocusOut(event);
    }

    get currentTool(): Tool {
        return this._currentTool;
    }

    set currentTool(tool: Tool) {
        if (this._currentTool === tool) {
            return;
        }

        if (this._currentTool !== undefined) {
            this._currentTool.onToolDeselection();
        }

        this._currentTool = tool;
        this._currentTool.onToolSelection();
    }

    private getMousePosition(event: MouseEvent): Vec2 {
        const ctm = this.drawingService.drawingRoot.getScreenCTM();
        if (ctm === null) {
            return { x: 0, y: 0 } as Vec2;
        }

        return {
            x: (event.clientX - ctm.e) / ctm.a,
            y: (event.clientY - ctm.f) / ctm.d,
        } as Vec2;
    }
}

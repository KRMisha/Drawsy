import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { MoveElementsCommand } from '@app/drawing/classes/commands/move-elements-command';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { SvgUtilityService } from '@app/drawing/services/svg-utility.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';

const controlPointSideSize = 10;

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionMoverService {
    totalSelectionMoveValue: Vec2 = { x: 0, y: 0 };

    private isArrowUpHeld = false;
    private isArrowDownHeld = false;
    private isArrowLeftHeld = false;
    private isArrowRightHeld = false;

    private movingIntervalId?: number;
    private movingTimeout?: number;

    constructor(
        private drawingService: DrawingService,
        private svgUtilityService: SvgUtilityService,
        private toolSelectionStateService: ToolSelectionStateService,
        private commandService: CommandService
    ) {}

    moveSelection(currentMousePos: Vec2, lastMousePos: Vec2): void {
        const deltaMousePos: Vec2 = {
            x: currentMousePos.x - lastMousePos.x,
            y: currentMousePos.y - lastMousePos.y,
        };
        this.totalSelectionMoveValue.x += deltaMousePos.x;
        this.totalSelectionMoveValue.y += deltaMousePos.y;

        this.drawingService.moveElementList(this.toolSelectionStateService.selectedElements, deltaMousePos);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.toolSelectionStateService.isMovingSelectionWithMouse) {
            return;
        }
        this.setArrowStateFromEvent(event, true);
        if (
            !this.toolSelectionStateService.isMovingSelectionWithArrows &&
            (this.isArrowUpHeld || this.isArrowDownHeld || this.isArrowLeftHeld || this.isArrowRightHeld)
        ) {
            this.toolSelectionStateService.isMovingSelectionWithArrows = true;
            this.moveSelectionInArrowDirection();
            const timeoutDurationMs = 500;
            this.movingTimeout = window.setTimeout(() => {
                const movingIntervalMs = 100;
                this.movingIntervalId = window.setInterval(() => {
                    this.moveSelectionInArrowDirection();
                }, movingIntervalMs);
            }, timeoutDurationMs);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        this.setArrowStateFromEvent(event, false);
        if (!this.isArrowDownHeld && !this.isArrowUpHeld && !this.isArrowLeftHeld && !this.isArrowRightHeld) {
            if (this.totalSelectionMoveValue.x !== 0 || this.totalSelectionMoveValue.y !== 0) {
                this.addMoveCommand();
            }
            if (this.movingTimeout !== undefined) {
                window.clearTimeout(this.movingTimeout);
                this.movingTimeout = undefined;
            }
            window.clearInterval(this.movingIntervalId);
            this.movingIntervalId = undefined;
            this.toolSelectionStateService.isMovingSelectionWithArrows = false;
        }
    }

    addMoveCommand(): void {
        const selectedElementsCopy = [...this.toolSelectionStateService.selectedElements];
        this.commandService.addCommand(new MoveElementsCommand(this.drawingService, selectedElementsCopy, this.totalSelectionMoveValue));
        this.totalSelectionMoveValue = { x: 0, y: 0 };
    }

    updateSvgSelectedShapesRect(selectedElement: SVGElement[]): void {
        const elementsBounds = this.svgUtilityService.getElementListBounds(selectedElement);
        if (elementsBounds !== undefined) {
            this.svgUtilityService.updateSvgRectFromRect(this.toolSelectionStateService.svgSelectedShapesRect, elementsBounds);
            this.toolSelectionStateService.svgSelectedShapesRect.setAttribute('display', 'block');

            this.toolSelectionStateService.selectionRect = elementsBounds;
            const positions = [
                { x: elementsBounds.x, y: elementsBounds.y + elementsBounds.height / 2 } as Vec2,
                { x: elementsBounds.x + elementsBounds.width / 2, y: elementsBounds.y } as Vec2,
                { x: elementsBounds.x + elementsBounds.width, y: elementsBounds.y + elementsBounds.height / 2 } as Vec2,
                { x: elementsBounds.x + elementsBounds.width / 2, y: elementsBounds.y + elementsBounds.height } as Vec2,
            ];
            for (let i = 0; i < positions.length; i++) {
                this.toolSelectionStateService.svgControlPoints[i].setAttribute(
                    'x',
                    (positions[i].x - controlPointSideSize / 2).toString()
                );
                this.toolSelectionStateService.svgControlPoints[i].setAttribute(
                    'y',
                    (positions[i].y - controlPointSideSize / 2).toString()
                );
                this.toolSelectionStateService.svgControlPoints[i].setAttribute('display', 'block');
            }
            this.toolSelectionStateService.selectionRect = elementsBounds;
        } else {
            this.hideSvgSelectedShapesRect();
            this.toolSelectionStateService.selectionRect = undefined;
        }
    }

    hideSvgSelectedShapesRect(): void {
        this.toolSelectionStateService.svgSelectedShapesRect.setAttribute('display', 'none');
        for (const controlPoint of this.toolSelectionStateService.svgControlPoints) {
            controlPoint.setAttribute('display', 'none');
        }
    }

    private setArrowStateFromEvent(event: KeyboardEvent, state: boolean): void {
        switch (event.key) {
            case 'ArrowUp':
                this.isArrowUpHeld = state;
                break;
            case 'ArrowDown':
                this.isArrowDownHeld = state;
                break;
            case 'ArrowLeft':
                this.isArrowLeftHeld = state;
                break;
            case 'ArrowRight':
                this.isArrowRightHeld = state;
                break;
        }
    }

    private moveSelectionInArrowDirection(): void {
        const moveDirection: Vec2 = { x: 0, y: 0 };
        const moveDelta = 3;
        if (this.isArrowLeftHeld !== this.isArrowRightHeld) {
            moveDirection.x = this.isArrowRightHeld ? moveDelta : -moveDelta;
        }
        if (this.isArrowUpHeld !== this.isArrowDownHeld) {
            moveDirection.y = this.isArrowDownHeld ? moveDelta : -moveDelta;
        }

        this.totalSelectionMoveValue.x += moveDirection.x;
        this.totalSelectionMoveValue.y += moveDirection.y;
        this.drawingService.moveElementList(this.toolSelectionStateService.selectedElements, moveDirection);
        this.updateSvgSelectedShapesRect(this.toolSelectionStateService.selectedElements);
    }
}

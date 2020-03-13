import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { MoveElementsCommand } from '@app/drawing/classes/commands/move-elements-command';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { SvgUtilitiesService } from '@app/drawing/services/svg-utilities.service';
import { ToolSelectionStateService } from './tool-selection-state.service';

const controlPointSideSize = 10;

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionMoverService {
    private arrowUpHeld = false;
    private arrowDownHeld = false;
    private arrowLeftHeld = false;
    private arrowRightHeld = false;

    private movingIntervalId?: number;
    private movingTimeout?: number;

    private isMovingWithArrows = false;

    totalSelectionMoveValue: Vec2 = { x: 0, y: 0 };

    constructor(
        private drawingService: DrawingService,
        private svgUtilitiesService: SvgUtilitiesService,
        private toolSelectionStateService: ToolSelectionStateService,
        private commandService: CommandService,
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
        this.setArrowStateFromEvent(event, true);
        console.log(this.arrowDownHeld);
        if (!this.isMovingWithArrows && (this.arrowUpHeld || this.arrowDownHeld || this.arrowLeftHeld || this.arrowRightHeld)) {
            this.isMovingWithArrows = true;
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
        if (!this.arrowDownHeld && !this.arrowUpHeld && !this.arrowLeftHeld && !this.arrowRightHeld) {
            if (this.totalSelectionMoveValue.x !== 0 || this.totalSelectionMoveValue.y !== 0) {
                this.addMoveCommand();
            }
            if (this.movingTimeout !== undefined) {
                window.clearTimeout(this.movingTimeout);
                this.movingTimeout = undefined;
            }
            window.clearInterval(this.movingIntervalId);
            this.movingIntervalId = undefined;
            this.isMovingWithArrows = false;
        }
    }

    addMoveCommand(): void {
        const selectedElementsCopy = [...this.toolSelectionStateService.selectedElements];
        this.commandService.addCommand(new MoveElementsCommand(this.drawingService, selectedElementsCopy, this.totalSelectionMoveValue));
        this.totalSelectionMoveValue = { x: 0, y: 0 };
    }

    updateSvgSelectedShapesRect(selectedElement: SVGElement[]): void {
        const elementsBounds = this.svgUtilitiesService.getElementListBounds(selectedElement);
        if (elementsBounds !== undefined) {
            this.svgUtilitiesService.updateSvgRectFromRect(this.toolSelectionStateService.svgSelectedShapesRect, elementsBounds);
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
                    (positions[i].x - controlPointSideSize / 2).toString(),
                );
                this.toolSelectionStateService.svgControlPoints[i].setAttribute(
                    'y',
                    (positions[i].y - controlPointSideSize / 2).toString(),
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
                this.arrowUpHeld = state;
                break;
            case 'ArrowDown':
                this.arrowDownHeld = state;
                break;
            case 'ArrowLeft':
                this.arrowLeftHeld = state;
                break;
            case 'ArrowRight':
                this.arrowRightHeld = state;
                break;
        }
    }

    private moveSelectionInArrowDirection(): void {
        console.log(this.arrowDownHeld);

        const moveDirection: Vec2 = { x: 0, y: 0 };
        const moveDelta = 3;
        if (this.arrowLeftHeld !== this.arrowRightHeld) {
            moveDirection.x = this.arrowRightHeld ? moveDelta : -moveDelta;
        }
        if (this.arrowUpHeld !== this.arrowDownHeld) {
            moveDirection.y = this.arrowDownHeld ? moveDelta : -moveDelta;
        }

        this.totalSelectionMoveValue.x += moveDirection.x;
        this.totalSelectionMoveValue.y += moveDirection.y;
        this.drawingService.moveElementList(this.toolSelectionStateService.selectedElements, moveDirection);
        this.updateSvgSelectedShapesRect(this.toolSelectionStateService.selectedElements);
    }
}

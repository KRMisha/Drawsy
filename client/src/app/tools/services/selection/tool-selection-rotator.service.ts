import { Injectable } from '@angular/core';
import { TransformElementsCommand } from '@app/drawing/classes/commands/transform-elements-command';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Vec2 } from '@app/shared/classes/vec2';
import { SelectionState } from '@app/tools/enums/selection-state.enum';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
import { ToolSelectionMoverService } from '@app/tools/services/selection/tool-selection-mover.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionTransformService } from '@app/tools/services/selection/tool-selection-transform.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionRotatorService {
    constructor(
        private drawingService: DrawingService,
        private toolSelectionMoverService: ToolSelectionMoverService,
        private toolSelectionCollisionService: ToolSelectionCollisionService,
        private toolSelectionTransformService: ToolSelectionTransformService,
        private toolSelectionStateService: ToolSelectionStateService,
        private historyService: HistoryService
    ) {}

    onScroll(event: WheelEvent): void {
        if (this.toolSelectionStateService.state !== SelectionState.None || this.toolSelectionStateService.selectedElements.length === 0) {
            return;
        }

        if (event.deltaY === 0) {
            return;
        }

        const selectedElementTransformsBeforeRotate = this.toolSelectionTransformService.getElementListTransformsCopy(
            this.toolSelectionStateService.selectedElements
        );
        this.toolSelectionTransformService.initializeElementTransforms(this.toolSelectionStateService.selectedElements);

        const angle = this.getAngle(event.deltaY, event.altKey);

        const isIndividualRotation = event.shiftKey;
        isIndividualRotation ? this.rotateSelectedElementsIndividually(angle) : this.rotateSelectionAroundCenter(angle);

        const selectedElementsCopy = [...this.toolSelectionStateService.selectedElements];
        this.historyService.addCommand(
            new TransformElementsCommand(
                selectedElementsCopy,
                selectedElementTransformsBeforeRotate,
                this.toolSelectionTransformService.getElementListTransformsCopy(this.toolSelectionStateService.selectedElements)
            )
        );
    }

    private getAngle(mouseWheelDeltaY: number, isSmallAngle: boolean): number {
        const smallAngleRotationDegrees = 1;
        const bigAngleRotationDegrees = 15;
        return (mouseWheelDeltaY > 0 ? 1 : -1) * (isSmallAngle ? smallAngleRotationDegrees : bigAngleRotationDegrees);
    }

    private rotateSelectionAroundCenter(angle: number): void {
        if (this.toolSelectionStateService.selectedElementsRect === undefined) {
            return;
        }

        const selectedElementsRectCenterBeforeRotation: Vec2 = {
            x: this.toolSelectionStateService.selectedElementsRect.x + this.toolSelectionStateService.selectedElementsRect.width / 2,
            y: this.toolSelectionStateService.selectedElementsRect.y + this.toolSelectionStateService.selectedElementsRect.height / 2,
        };

        const rotationPoint = this.drawingService.drawingRoot.createSVGPoint();
        rotationPoint.x = selectedElementsRectCenterBeforeRotation.x;
        rotationPoint.y = selectedElementsRectCenterBeforeRotation.y;

        for (const element of this.toolSelectionStateService.selectedElements) {
            this.rotateElementAroundPoint(element, rotationPoint, angle);
        }

        this.toolSelectionStateService.selectedElementsRect = this.toolSelectionCollisionService.getElementListBounds(
            this.toolSelectionStateService.selectedElements
        );

        // Disable non-null assertion lint error because the selectedElementsRect will always be defined since a selection exists
        // tslint:disable: no-non-null-assertion
        const selectedElementsRectCenterAfterRotation: Vec2 = {
            x: this.toolSelectionStateService.selectedElementsRect!.x + this.toolSelectionStateService.selectedElementsRect!.width / 2,
            y: this.toolSelectionStateService.selectedElementsRect!.y + this.toolSelectionStateService.selectedElementsRect!.height / 2,
        };
        // tslint:enable: no-non-null-assertion

        const rotationMovementToCorrect: Vec2 = {
            x: selectedElementsRectCenterBeforeRotation.x - selectedElementsRectCenterAfterRotation.x,
            y: selectedElementsRectCenterBeforeRotation.y - selectedElementsRectCenterAfterRotation.y,
        };

        this.toolSelectionMoverService.moveSelection(rotationMovementToCorrect);
    }

    private rotateSelectedElementsIndividually(angle: number): void {
        for (const element of this.toolSelectionStateService.selectedElements) {
            const elementBounds = this.toolSelectionCollisionService.getElementBounds(element);
            const rotationPoint = this.drawingService.drawingRoot.createSVGPoint();
            rotationPoint.x = elementBounds.x + elementBounds.width / 2;
            rotationPoint.y = elementBounds.y + elementBounds.height / 2;
            this.rotateElementAroundPoint(element, rotationPoint, angle);
        }
        this.toolSelectionStateService.selectedElementsRect = this.toolSelectionCollisionService.getElementListBounds(
            this.toolSelectionStateService.selectedElements
        );
    }

    private rotateElementAroundPoint(element: SVGGraphicsElement, point: SVGPoint, angle: number): void {
        // TODO: Justify (Disable non-null assertion lint error because ...)
        // tslint:disable-next-line: no-non-null-assertion
        const globalToLocalMatrix = this.drawingService.drawingRoot.getScreenCTM()!.inverse().multiply(element.getScreenCTM()!).inverse();
        const localCenterOfRotation = point.matrixTransform(globalToLocalMatrix);

        const rotateTransformIndex = 1;
        const newMatrix = element.transform.baseVal
            .getItem(rotateTransformIndex)
            .matrix.translate(localCenterOfRotation.x, localCenterOfRotation.y)
            .rotate(angle)
            .translate(-localCenterOfRotation.x, -localCenterOfRotation.y);
        element.transform.baseVal.getItem(rotateTransformIndex).setMatrix(newMatrix);
    }
}

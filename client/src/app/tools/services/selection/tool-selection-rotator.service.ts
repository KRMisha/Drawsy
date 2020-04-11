import { Injectable } from '@angular/core';
import { TransformElementsCommand } from '@app/drawing/classes/commands/transform-elements-command';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Vec2 } from '@app/shared/classes/vec2';
import { SelectionState } from '@app/tools/enums/selection-state.enum';
import { ToolSelectionCollisionService } from './tool-selection-collision.service';
import { ToolSelectionMoverService } from './tool-selection-mover.service';
import { ToolSelectionStateService } from './tool-selection-state.service';
import { ToolSelectionTransformService } from './tool-selection-transform.service';

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

    // Note a Misha:                                     ecq ce nom est deg
    onScroll(mouseDeltaY: number, isSmallAngle: boolean, isIndividualRotation: boolean): void {
        if (
            this.toolSelectionStateService.state !== SelectionState.None ||
            this.toolSelectionStateService.selectedElements.length === 0
        ) {
            return;
        }

        if (mouseDeltaY === 0) {
            return;
        }

        const selectedElementTransformsBeforeRotate = this.toolSelectionTransformService.getElementListTransformsCopy(
            this.toolSelectionStateService.selectedElements
        );

        this.toolSelectionTransformService.initializeElementTransforms(this.toolSelectionStateService.selectedElements);
        const angle = this.getAngle(mouseDeltaY, isSmallAngle);

        if (isIndividualRotation) {
            this.rotateSelectedElements(angle);
        } else {
            this.rotateSelection(angle);
        }
        // Note a misha:
        // Ecq c'est mieux de faire un ternary?
        // isIndividualRotation ? this.rotateSelectedElements(angle) : this.rotateSelection(angle);

        const selectedElementsCopy = [...this.toolSelectionStateService.selectedElements];
        this.historyService.addCommand(
            new TransformElementsCommand(
                selectedElementsCopy,
                selectedElementTransformsBeforeRotate,
                this.toolSelectionTransformService.getElementListTransformsCopy(this.toolSelectionStateService.selectedElements)
            )
        );
    }

    private getAngle(mouseDeltaY: number, isSmallAngle: boolean): number {
        const smallAngleChange = 1;
        const bigAngleChange = 15;
        return (mouseDeltaY > 0 ? 1 : -1) * (isSmallAngle ? smallAngleChange : bigAngleChange);
    }

    private rotateSelection(angle: number): void {
        if (this.toolSelectionStateService.selectedElementsRect === undefined) {
            return;
        }
        const centerOfSelectedElementsRectBeforeRotation: Vec2 = {
            x: this.toolSelectionStateService.selectedElementsRect.x + this.toolSelectionStateService.selectedElementsRect.width / 2,
            y: this.toolSelectionStateService.selectedElementsRect.y + this.toolSelectionStateService.selectedElementsRect.height / 2,
        };

        const rotationPoint = this.drawingService.drawingRoot.createSVGPoint();
        rotationPoint.x =
            this.toolSelectionStateService.selectedElementsRect.x + this.toolSelectionStateService.selectedElementsRect.width / 2;
        rotationPoint.y =
            this.toolSelectionStateService.selectedElementsRect.y + this.toolSelectionStateService.selectedElementsRect.height / 2;

        for (const element of this.toolSelectionStateService.selectedElements) {
            this.rotateElementAroundPoint(element, rotationPoint, angle);
        }

        this.toolSelectionStateService.selectedElementsRect = this.toolSelectionCollisionService.getElementListBounds(
            this.toolSelectionStateService.selectedElements
        );

        // tslint:disable: no-non-null-assertion
        const centerOfSelectedElementsRectAfterRotation: Vec2 = {
            x: this.toolSelectionStateService.selectedElementsRect!.x + this.toolSelectionStateService.selectedElementsRect!.width / 2,
            y: this.toolSelectionStateService.selectedElementsRect!.y + this.toolSelectionStateService.selectedElementsRect!.height / 2,
        };
        // tslint:enable: no-non-null-assertion

        const moveDuringRotationToCorrect: Vec2 = {
            x: centerOfSelectedElementsRectBeforeRotation.x - centerOfSelectedElementsRectAfterRotation.x,
            y: centerOfSelectedElementsRectBeforeRotation.y - centerOfSelectedElementsRectAfterRotation.y,
        };

        this.toolSelectionMoverService.moveSelection(moveDuringRotationToCorrect);
    }

    private rotateSelectedElements(angle: number): void {
        for (const element of this.toolSelectionStateService.selectedElements) {
            const elementRect = this.toolSelectionCollisionService.getElementBounds(element);
            const rotationPoint = this.drawingService.drawingRoot.createSVGPoint();
            rotationPoint.x = elementRect.x + elementRect.width / 2;
            rotationPoint.y = elementRect.y + elementRect.height / 2;
            this.rotateElementAroundPoint(element, rotationPoint, angle);
        }
        this.toolSelectionStateService.selectedElementsRect = this.toolSelectionCollisionService.getElementListBounds(
            this.toolSelectionStateService.selectedElements
        );
    }

    private rotateElementAroundPoint(element: SVGGraphicsElement, point: SVGPoint, angle: number): void {
        const globalToLocalMatrix =
            // tslint:disable-next-line: no-non-null-assertion
            this.drawingService.drawingRoot.getScreenCTM()!.inverse().multiply(element.getScreenCTM()!).inverse();
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

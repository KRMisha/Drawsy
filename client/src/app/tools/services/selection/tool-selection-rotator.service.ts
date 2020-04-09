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

    onScroll(deltaY: number, isSmallAngle: boolean, isIndividualRotation: boolean): void {
        if (
            this.toolSelectionStateService.state !== SelectionState.None ||
            this.toolSelectionStateService.selectedElementsRect === undefined
        ) {
            return;
        }

        if (deltaY === 0) {
            return;
        }

        const selectedElementTransformsBeforeRotate = this.toolSelectionTransformService.getElementListTransformsCopy(
            this.toolSelectionStateService.selectedElements
        );

        this.toolSelectionTransformService.initializeElementTransforms(this.toolSelectionStateService.selectedElements);

        const centerOfSelectedElementsRectBeforeRotation: Vec2 = {
            x: this.toolSelectionStateService.selectedElementsRect.x + this.toolSelectionStateService.selectedElementsRect.width / 2,
            y: this.toolSelectionStateService.selectedElementsRect.y + this.toolSelectionStateService.selectedElementsRect.height / 2,
        };

        for (const element of this.toolSelectionStateService.selectedElements) {
            const scrollDirection = deltaY > 0 ? 1 : -1;
            const smallAngleChange = 1;
            const bigAngleChange = 15;
            const angleChange = scrollDirection * (isSmallAngle ? smallAngleChange : bigAngleChange);

            const rect = isIndividualRotation
                ? this.toolSelectionCollisionService.getElementBounds(element)
                : this.toolSelectionStateService.selectedElementsRect;

            const globalCenterOfRotation = this.drawingService.drawingRoot.createSVGPoint();
            globalCenterOfRotation.x = rect.x + rect.width / 2;
            globalCenterOfRotation.y = rect.y + rect.height / 2;

            const globalToLocalMatrix =
                // tslint:disable-next-line: no-non-null-assertion
                this.drawingService.drawingRoot.getScreenCTM()!.inverse().multiply(element.getScreenCTM()!).inverse();
            const localCenterOfRotation = globalCenterOfRotation.matrixTransform(globalToLocalMatrix);

            const rotateTransformIndex = 1;
            const newMatrix = element.transform.baseVal
                .getItem(rotateTransformIndex)
                .matrix.translate(localCenterOfRotation.x, localCenterOfRotation.y)
                .rotate(angleChange)
                .translate(-localCenterOfRotation.x, -localCenterOfRotation.y);
            element.transform.baseVal.getItem(rotateTransformIndex).setMatrix(newMatrix);
        }

        this.toolSelectionStateService.selectedElementsRect = this.toolSelectionCollisionService.getElementListBounds(
            this.toolSelectionStateService.selectedElements
        );

        if (!isIndividualRotation) {
            // tslint:disable: no-non-null-assertion
            const centerOfSelectedElementsRectAfterRotation: Vec2 = {
                x: this.toolSelectionStateService.selectedElementsRect!.x + this.toolSelectionStateService.selectedElementsRect!.width / 2,
                y: this.toolSelectionStateService.selectedElementsRect!.y + this.toolSelectionStateService.selectedElementsRect!.height / 2,
            };
            // tslint:enable: no-non-null-assertion

            const moveDuringRotation: Vec2 = {
                x: centerOfSelectedElementsRectBeforeRotation.x - centerOfSelectedElementsRectAfterRotation.x,
                y: centerOfSelectedElementsRectBeforeRotation.y - centerOfSelectedElementsRectAfterRotation.y,
            };

            this.toolSelectionMoverService.moveSelection(moveDuringRotation);
        }

        const selectedElementsCopy = [...this.toolSelectionStateService.selectedElements];
        this.historyService.addCommand(
            new TransformElementsCommand(
                selectedElementsCopy,
                selectedElementTransformsBeforeRotate,
                this.toolSelectionTransformService.getElementListTransformsCopy(
                    this.toolSelectionStateService.selectedElements
                )
            )
        );
    }
}

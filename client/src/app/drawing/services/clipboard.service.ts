import { Injectable } from '@angular/core';
import { AppendElementsCommand } from '@app/drawing/classes/commands/append-elements-command';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Rect } from '@app/shared/classes/rect';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
import { ToolSelectionMoverService } from '@app/tools/services/selection/tool-selection-mover.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionTransformService } from '@app/tools/services/selection/tool-selection-transform.service';
import { ToolSelectionService } from '@app/tools/services/selection/tool-selection.service';

const placementPositionOffsetIncrement = 25;

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    private copiedElements: SVGGraphicsElement[] = [];

    private placementPositionOffset = 0;

    constructor(
        private historyService: HistoryService,
        private toolSelectionStateService: ToolSelectionStateService,
        private toolSelectionMoverService: ToolSelectionMoverService,
        private toolSelectionCollisionService: ToolSelectionCollisionService,
        private toolSelectionTransformService: ToolSelectionTransformService,
        private drawingService: DrawingService,
        private toolSelectionService: ToolSelectionService
    ) {}

    copy(): void {
        if (!this.hasSelection()) {
            return;
        }

        this.placementPositionOffset = 0;
        this.copiedElements = [...this.toolSelectionStateService.selectedElements];
    }

    paste(): void {
        if (!this.hasCopiedElements()) {
            return;
        }

        this.placeElements(this.copiedElements);

        const isNextPlacementOutOfDrawing = this.isNextPlacementOutOfDrawing(
            this.toolSelectionStateService.selectedElements,
            this.placementPositionOffset + placementPositionOffsetIncrement
        );

        if (isNextPlacementOutOfDrawing) {
            this.placementPositionOffset = 0;
        } else {
            this.placementPositionOffset += placementPositionOffsetIncrement;
            this.toolSelectionTransformService.initializeElementTransforms(this.toolSelectionStateService.selectedElements);
            this.toolSelectionMoverService.moveSelection({ x: this.placementPositionOffset, y: this.placementPositionOffset });
        }
    }

    cut(): void {
        if (!this.hasSelection()) {
            return;
        }

        this.copy();
        this.toolSelectionService.deleteSelection();
    }

    duplicate(): void {
        if (!this.hasSelection()) {
            return;
        }

        this.placeElements(this.toolSelectionStateService.selectedElements);

        const isNextPlacementOutOfDrawing =
            this.isNextPlacementOutOfDrawing(this.toolSelectionStateService.selectedElements, placementPositionOffsetIncrement);

        if (!isNextPlacementOutOfDrawing) {
            this.toolSelectionTransformService.initializeElementTransforms(this.toolSelectionStateService.selectedElements);
            this.toolSelectionMoverService.moveSelection({ x: placementPositionOffsetIncrement, y: placementPositionOffsetIncrement });
        }
    }

    hasSelection(): boolean {
        return this.toolSelectionStateService.selectedElements.length > 0;
    }

    hasCopiedElements(): boolean {
        return this.copiedElements.length > 0;
    }

    private placeElements(elements: SVGGraphicsElement[]): void {
        const elementCopies: SVGGraphicsElement[] = [];
        for (const element of elements) {
            const elementCopy = element.cloneNode(true) as SVGGraphicsElement;
            this.drawingService.addElement(elementCopy);
            elementCopies.push(elementCopy);
        }
        this.toolSelectionStateService.selectedElements = elementCopies;
        this.historyService.addCommand(new AppendElementsCommand(this.drawingService, elementCopies));
    }

    private isNextPlacementOutOfDrawing(elementsToPlace: SVGGraphicsElement[], nextPlacementPositionOffset: number): boolean {
        const elementsToPlaceRect = this.toolSelectionCollisionService.getElementListBounds(elementsToPlace) as Rect;
        return (
            elementsToPlaceRect.x + nextPlacementPositionOffset >= this.drawingService.dimensions.x ||
            elementsToPlaceRect.y + nextPlacementPositionOffset >= this.drawingService.dimensions.y
        );
    }
}

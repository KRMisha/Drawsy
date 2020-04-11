import { Injectable, OnDestroy } from '@angular/core';
import { AppendElementsClipboardCommand } from '@app/drawing/classes/commands/append-elements-clipboard-command';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Rect } from '@app/shared/classes/rect';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
import { ToolSelectionMoverService } from '@app/tools/services/selection/tool-selection-mover.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionTransformService } from '@app/tools/services/selection/tool-selection-transform.service';
import { ToolSelectionService } from '@app/tools/services/selection/tool-selection.service';
import { Subscription } from 'rxjs';

const placementPositionOffsetIncrement = 25;

@Injectable({
    providedIn: 'root',
})
export class ClipboardService implements OnDestroy {
    placementPositionOffset = 0;

    private selectionChangedSubscription: Subscription;

    private clipboardBuffer: SVGGraphicsElement[] = [];
    private duplicationBuffer: SVGGraphicsElement[] = [];

    constructor(
        private historyService: HistoryService,
        private toolSelectionStateService: ToolSelectionStateService,
        private toolSelectionMoverService: ToolSelectionMoverService,
        private toolSelectionCollisionService: ToolSelectionCollisionService,
        private toolSelectionTransformService: ToolSelectionTransformService,
        private drawingService: DrawingService,
        private toolSelectionService: ToolSelectionService
    ) {
        this.subscribeToSelectionChanged();
    }

    ngOnDestroy(): void {
        this.selectionChangedSubscription.unsubscribe();
    }

    copy(): void {
        if (!this.hasSelection()) {
            return;
        }

        this.placementPositionOffset = 0;
        this.clipboardBuffer = [...this.toolSelectionStateService.selectedElements];
        this.duplicationBuffer = [...this.toolSelectionStateService.selectedElements];
    }

    paste(): void {
        if (!this.hasCopiedElements()) {
            return;
        }

        this.placeElements(this.clipboardBuffer);
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

        this.placeElements(this.duplicationBuffer);
    }

    hasSelection(): boolean {
        return this.toolSelectionStateService.selectedElements.length > 0;
    }

    hasCopiedElements(): boolean {
        return this.clipboardBuffer.length > 0;
    }

    private placeElements(elements: SVGGraphicsElement[]): void {
        this.selectionChangedSubscription.unsubscribe();

        const elementCopies: SVGGraphicsElement[] = [];
        for (const element of elements) {
            const elementCopy = element.cloneNode(true) as SVGGraphicsElement;
            this.drawingService.addElement(elementCopy);
            elementCopies.push(elementCopy);
        }

        this.toolSelectionStateService.selectedElements = elementCopies;
        const isNextPlacementOutOfDrawing = this.isNextPlacementOutOfDrawing(
            this.toolSelectionStateService.selectedElements,
            this.placementPositionOffset + placementPositionOffsetIncrement
        );

        const offsetBefore = this.placementPositionOffset;

        if (isNextPlacementOutOfDrawing) {
            this.placementPositionOffset = 0;
        } else {
            this.placementPositionOffset += placementPositionOffsetIncrement;
            this.toolSelectionTransformService.initializeElementTransforms(this.toolSelectionStateService.selectedElements);
            this.toolSelectionMoverService.moveSelection({ x: this.placementPositionOffset, y: this.placementPositionOffset });
        }

        this.historyService.addCommand(
            new AppendElementsClipboardCommand(
                this,
                this.drawingService,
                [...this.toolSelectionStateService.selectedElements],
                offsetBefore,
                this.placementPositionOffset
            )
        );

        this.subscribeToSelectionChanged();
    }

    private isNextPlacementOutOfDrawing(elementsToPlace: SVGGraphicsElement[], nextPlacementPositionOffset: number): boolean {
        const elementsToPlaceRect = this.toolSelectionCollisionService.getElementListBounds(elementsToPlace) as Rect;
        return (
            elementsToPlaceRect.x + nextPlacementPositionOffset >= this.drawingService.dimensions.x ||
            elementsToPlaceRect.y + nextPlacementPositionOffset >= this.drawingService.dimensions.y
        );
    }

    private subscribeToSelectionChanged(): void {
        this.selectionChangedSubscription = this.toolSelectionStateService.selectedElementsChanged$.subscribe(
            (elements: SVGGraphicsElement[]) => {
                if (!this.hasSelection()) {
                    return;
                }

                this.duplicationBuffer = [...elements];
                this.placementPositionOffset = 0;
            }
        );
    }
}

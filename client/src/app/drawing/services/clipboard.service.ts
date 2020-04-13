import { Injectable, OnDestroy } from '@angular/core';
import { AppendElementsClipboardCommand } from '@app/drawing/classes/commands/append-elements-clipboard-command';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Rect } from '@app/shared/classes/rect';
import { SelectionState } from '@app/tools/enums/selection-state.enum';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
import { ToolSelectionMoverService } from '@app/tools/services/selection/tool-selection-mover.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionTransformService } from '@app/tools/services/selection/tool-selection-transform.service';
import { ToolSelectionService } from '@app/tools/services/selection/tool-selection.service';
import { Subscription } from 'rxjs';

const placementPositionOffsetIncrement = 25;

enum PlacementType {
    Clipboard,
    Duplication,
}

@Injectable({
    providedIn: 'root',
})
export class ClipboardService implements OnDestroy {
    clipboardPositionOffset = 0;
    duplicationPositionOffset = 0;

    private selectionChangedSubscription: Subscription;

    private clipboardOriginalElements: SVGGraphicsElement[] = [];
    private clipboardBuffer: SVGGraphicsElement[] = [];

    private duplicationOriginalElements: SVGGraphicsElement[] = [];
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
        if (!this.isSelectionAvailable()) {
            return;
        }

        this.setOffset(PlacementType.Clipboard, 0);
        this.setOffset(PlacementType.Duplication, 0);

        this.clipboardOriginalElements = [...this.toolSelectionStateService.selectedElements];
        this.duplicationOriginalElements = this.clipboardOriginalElements;

        this.clipboardBuffer = this.getElementsCopy(this.toolSelectionStateService.selectedElements);
        this.duplicationBuffer = this.getElementsCopy(this.toolSelectionStateService.selectedElements);
    }

    paste(): void {
        if (!this.isPastingAvailable()) {
            return;
        }

        this.duplicationOriginalElements = this.clipboardOriginalElements;
        this.duplicationBuffer = this.getElementsCopy(this.clipboardBuffer);

        this.placeElements(PlacementType.Clipboard);
    }

    cut(): void {
        if (!this.isSelectionAvailable()) {
            return;
        }

        this.copy();
        this.toolSelectionService.deleteSelection();
    }

    duplicate(): void {
        if (!this.isSelectionAvailable()) {
            return;
        }

        this.placeElements(PlacementType.Duplication);
    }

    isPastingAvailable(): boolean {
        return this.clipboardBuffer.length > 0 && this.toolSelectionStateService.state === SelectionState.None;
    }

    isSelectionAvailable(): boolean {
        return this.toolSelectionStateService.selectedElements.length > 0 && this.toolSelectionStateService.state === SelectionState.None;
    }

    private getElementsCopy(elements: SVGGraphicsElement[]): SVGGraphicsElement[] {
        const elementCopies: SVGGraphicsElement[] = [];
        for (const element of elements) {
            elementCopies.push(element.cloneNode(true) as SVGGraphicsElement);
        }
        return elementCopies;
    }

    private getOffset(placementType: PlacementType): number {
        switch (placementType) {
            case PlacementType.Clipboard:
                return this.clipboardPositionOffset;
            case PlacementType.Duplication:
                return this.duplicationPositionOffset;
        }
    }

    private setOffset(placementType: PlacementType, offset: number): void {
        switch (placementType) {
            case PlacementType.Clipboard:
                this.clipboardPositionOffset = offset;
                break;
            case PlacementType.Duplication:
                this.duplicationPositionOffset = offset;
        }
    }

    private placeElements(placementType: PlacementType): void {
        this.selectionChangedSubscription.unsubscribe();

        const isClipboard = placementType === PlacementType.Clipboard;
        const originalElements = isClipboard ? this.clipboardOriginalElements : this.duplicationOriginalElements;
        const bufferedElements = isClipboard ? this.clipboardBuffer : this.duplicationBuffer;

        const copiedElementsToPlace = this.getElementsCopy(bufferedElements);
        for (const element of copiedElementsToPlace) {
            this.drawingService.addElement(element);
        }

        this.toolSelectionStateService.selectedElements = copiedElementsToPlace;

        const elementsInDrawing = new Set<SVGGraphicsElement>(this.drawingService.svgElements);
        const areSomeElementsStillInDrawing = originalElements.some((element: SVGGraphicsElement) => elementsInDrawing.has(element));

        if (!areSomeElementsStillInDrawing) {
            this.clipboardBuffer = copiedElementsToPlace;
            this.duplicationBuffer = copiedElementsToPlace;
        }

        const clipboardOffsetBefore = this.getOffset(PlacementType.Clipboard);
        const duplicationOffsetBefore = this.getOffset(PlacementType.Duplication);

        this.offsetSelectedElements(areSomeElementsStillInDrawing, placementType);

        this.historyService.addCommand(
            new AppendElementsClipboardCommand(
                this,
                this.drawingService,
                [...copiedElementsToPlace],
                clipboardOffsetBefore,
                duplicationOffsetBefore,
                this.getOffset(PlacementType.Clipboard),
                this.getOffset(PlacementType.Duplication)
            )
        );

        this.subscribeToSelectionChanged();
    }

    private offsetSelectedElements(areSomeElementsStillInDrawing: boolean, placementType: PlacementType): void {
        let offset = this.getOffset(placementType);
        if (this.isNextPlacementOutOfDrawing(placementType) || !areSomeElementsStillInDrawing) {
            offset = 0;
        } else {
            offset += placementPositionOffsetIncrement;
            this.toolSelectionTransformService.initializeElementTransforms(this.toolSelectionStateService.selectedElements);
            this.toolSelectionMoverService.moveSelection({ x: offset, y: offset });
        }

        if (this.clipboardOriginalElements === this.duplicationOriginalElements) {
            this.setOffset(PlacementType.Clipboard, offset);
            this.setOffset(PlacementType.Duplication, offset);
        } else {
            this.setOffset(placementType, offset);
        }
    }

    private isNextPlacementOutOfDrawing(placementType: PlacementType): boolean {
        const elementsToPlaceRect =
            this.toolSelectionCollisionService.getElementListBounds(this.toolSelectionStateService.selectedElements) as Rect;
        return (
            elementsToPlaceRect.x + this.getOffset(placementType) + placementPositionOffsetIncrement >= this.drawingService.dimensions.x ||
            elementsToPlaceRect.y + this.getOffset(placementType) + placementPositionOffsetIncrement >= this.drawingService.dimensions.y
        );
    }

    private subscribeToSelectionChanged(): void {
        this.selectionChangedSubscription = this.toolSelectionStateService.selectedElementsChanged$.subscribe(
            (elements: SVGGraphicsElement[]) => {
                this.duplicationBuffer = [...elements];
                this.setOffset(PlacementType.Duplication, 0);
            }
        );
    }
}

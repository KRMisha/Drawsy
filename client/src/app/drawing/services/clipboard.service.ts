import { Injectable, OnDestroy } from '@angular/core';
import { AddElementsClipboardCommand } from '@app/drawing/classes/commands/add-elements-clipboard-command';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
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

    private initialClipboardElements: SVGGraphicsElement[] = [];
    private clipboardBuffer: SVGGraphicsElement[] = [];

    private initialDuplicationElements: SVGGraphicsElement[] = [];

    private selectionChangedSubscription: Subscription;
    private drawingHistoryChangedSubscription: Subscription;

    constructor(
        private drawingService: DrawingService,
        private historyService: HistoryService,
        private toolSelectionService: ToolSelectionService,
        private toolSelectionStateService: ToolSelectionStateService,
        private toolSelectionMoverService: ToolSelectionMoverService,
        private toolSelectionCollisionService: ToolSelectionCollisionService,
        private toolSelectionTransformService: ToolSelectionTransformService
    ) {
        this.selectionChangedSubscription = this.toolSelectionStateService.selectedElementsChanged$.subscribe(
            this.onSelectionChange.bind(this)
        );
        this.drawingHistoryChangedSubscription = this.historyService.drawingHistoryChanged$.subscribe(
            this.onDrawingHistoryChange.bind(this)
        );
    }

    ngOnDestroy(): void {
        this.selectionChangedSubscription.unsubscribe();
        this.drawingHistoryChangedSubscription.unsubscribe();
    }

    copy(): void {
        if (!this.isSelectionAvailable()) {
            return;
        }

        this.clipboardPositionOffset = 0;
        this.duplicationPositionOffset = 0;

        this.initialClipboardElements = [...this.toolSelectionStateService.selectedElements];
        this.initialDuplicationElements = this.initialClipboardElements;

        this.clipboardBuffer = this.getElementsCopy(this.toolSelectionStateService.selectedElements);
    }

    paste(): void {
        if (!this.isPastingAvailable()) {
            return;
        }

        this.initialDuplicationElements = this.initialClipboardElements;

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

    isSelectionAvailable(): boolean {
        return this.toolSelectionStateService.selectedElements.length > 0 && this.toolSelectionStateService.state === SelectionState.None;
    }

    isPastingAvailable(): boolean {
        return this.clipboardBuffer.length > 0 && this.toolSelectionStateService.state === SelectionState.None;
    }

    private getElementsCopy(elements: SVGGraphicsElement[]): SVGGraphicsElement[] {
        return elements.map((element: SVGGraphicsElement) => element.cloneNode(true) as SVGGraphicsElement);
    }

    private placeElements(placementType: PlacementType): void {
        this.selectionChangedSubscription.unsubscribe();
        this.drawingHistoryChangedSubscription.unsubscribe();

        const initialElements = placementType === PlacementType.Clipboard ? this.initialClipboardElements : this.initialDuplicationElements;
        const buffer = placementType === PlacementType.Clipboard ? this.clipboardBuffer : this.initialDuplicationElements;

        const bufferCopyToPlace = this.getElementsCopy(buffer);
        for (const element of bufferCopyToPlace) {
            this.drawingService.addElement(element);
        }

        this.toolSelectionStateService.selectedElements = bufferCopyToPlace; // todo move to end

        const elementsInDrawing = new Set<SVGGraphicsElement>(this.drawingService.elements);
        const areNoInitialElementsRemaining = initialElements.every((element: SVGGraphicsElement) => !elementsInDrawing.has(element));

        if (areNoInitialElementsRemaining) {
            this.initialClipboardElements = bufferCopyToPlace;
            this.initialDuplicationElements = bufferCopyToPlace; // todo check offset 0???
        }

        const clipboardOffsetBefore = this.clipboardPositionOffset;
        const duplicationOffsetBefore = this.duplicationPositionOffset;

        this.offsetSelectedElements(areNoInitialElementsRemaining, placementType);

        this.historyService.addCommand(
            new AddElementsClipboardCommand(
                this,
                this.drawingService,
                [...bufferCopyToPlace],
                clipboardOffsetBefore,
                duplicationOffsetBefore,
                this.clipboardPositionOffset,
                this.duplicationPositionOffset
            )
        );

        this.selectionChangedSubscription = this.toolSelectionStateService.selectedElementsChanged$.subscribe(
            this.onSelectionChange.bind(this)
        );
        this.drawingHistoryChangedSubscription = this.historyService.drawingHistoryChanged$.subscribe(
            this.onDrawingHistoryChange.bind(this)
        );
    }

    private offsetSelectedElements(mustResetOffset: boolean, placementType: PlacementType): void {
        const currentOffset = placementType === PlacementType.Clipboard ? this.clipboardPositionOffset : this.duplicationPositionOffset;
        const nextOffset = mustResetOffset ? 0 : this.getNextOffset(this.toolSelectionStateService.selectedElements, currentOffset);

        if (nextOffset !== 0) {
            this.toolSelectionTransformService.initializeElementTransforms(this.toolSelectionStateService.selectedElements);
            this.toolSelectionMoverService.moveSelection({ x: nextOffset, y: nextOffset });
        }

        if (this.initialClipboardElements === this.initialDuplicationElements) {
            this.clipboardPositionOffset = nextOffset;
            this.duplicationPositionOffset = nextOffset;
        } else {
            placementType === PlacementType.Clipboard
                ? (this.clipboardPositionOffset = nextOffset)
                : (this.duplicationPositionOffset = nextOffset);
        }
    }

    private getNextOffset(elements: SVGGraphicsElement[], currentOffset: number): number {
        const elementsToPlaceBounds = this.toolSelectionCollisionService.getElementListBounds(elements);
        if (elementsToPlaceBounds === undefined) {
            return 0;
        }

        const nextOffset = currentOffset + placementPositionOffsetIncrement;

        const isOutsideDrawingHorizontally = elementsToPlaceBounds.x + nextOffset >= this.drawingService.dimensions.x;
        const isOutsideDrawingVertically = elementsToPlaceBounds.y + nextOffset >= this.drawingService.dimensions.y;
        if (isOutsideDrawingHorizontally || isOutsideDrawingVertically) {
            return 0;
        }

        return nextOffset;
    }

    private onSelectionChange(elements: SVGGraphicsElement[]): void {
        this.initialDuplicationElements = [...elements];
        this.duplicationPositionOffset = 0;
    }

    private onDrawingHistoryChange(): void {
        this.initialDuplicationElements = [...this.toolSelectionStateService.selectedElements];
        this.duplicationPositionOffset = 0;
    }
}

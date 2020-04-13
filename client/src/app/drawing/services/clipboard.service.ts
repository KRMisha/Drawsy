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
        if (!this.canModifySelection()) {
            return;
        }

        this.setOffset(PlacementType.Clipboard, 0);
        this.setOffset(PlacementType.Duplication, 0);
        this.clipboardBuffer = [...this.toolSelectionStateService.selectedElements];
        this.duplicationBuffer = this.toolSelectionStateService.selectedElements;
    }

    paste(): void {
        if (!this.canPasteElements()) {
            return;
        }

        if (this.duplicationBuffer !== this.clipboardBuffer) {
            this.duplicationBuffer = this.clipboardBuffer;
            this.setOffset(PlacementType.Duplication, this.getOffset(PlacementType.Clipboard));
        }

        this.placeElements(this.clipboardBuffer, PlacementType.Clipboard);
    }

    cut(): void {
        if (!this.canModifySelection()) {
            return;
        }

        this.copy();
        this.toolSelectionService.deleteSelection();
    }

    duplicate(): void {
        if (!this.canModifySelection() || this.duplicationBuffer.length === 0) {
            return;
        }

        this.placeElements(this.duplicationBuffer, PlacementType.Duplication);
    }

    canPasteElements(): boolean {
        return this.clipboardBuffer.length > 0 && this.toolSelectionStateService.state === SelectionState.None;
    }

    canModifySelection(): boolean {
        return this.toolSelectionStateService.selectedElements.length > 0 && this.toolSelectionStateService.state === SelectionState.None;
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

    private placeElements(elements: SVGGraphicsElement[], placementType: PlacementType): void {
        console.log('a');
        this.selectionChangedSubscription.unsubscribe();

        const elementCopies: SVGGraphicsElement[] = [];
        for (const element of elements) {
            const elementCopy = element.cloneNode(true) as SVGGraphicsElement;
            this.drawingService.addElement(elementCopy);
            elementCopies.push(elementCopy);
        }

        this.toolSelectionStateService.selectedElements = elementCopies;

        const clipboardOffsetBefore = this.getOffset(PlacementType.Clipboard);
        const duplicationOffsetBefore = this.getOffset(PlacementType.Duplication);

        const elementsInDrawing = new Set<SVGGraphicsElement>(this.drawingService.svgElements);
        const areSomeElementsStillInDrawing = elements.some((element: SVGGraphicsElement) => elementsInDrawing.has(element));

        this.offsetSelectedElements(areSomeElementsStillInDrawing, placementType);

        if (!areSomeElementsStillInDrawing) {
            elements = elementCopies;
        }

        this.historyService.addCommand(
            new AppendElementsClipboardCommand(
                this,
                this.drawingService,
                [...this.toolSelectionStateService.selectedElements],
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
            this.setOffset(placementType, 0);
        } else {
            offset += placementPositionOffsetIncrement;
            if (this.clipboardBuffer === this.duplicationBuffer) {
                this.setOffset(PlacementType.Clipboard, offset);
                this.setOffset(PlacementType.Duplication, offset);
            } else {
                this.setOffset(placementType, offset);
            }
            this.toolSelectionTransformService.initializeElementTransforms(this.toolSelectionStateService.selectedElements);
            this.toolSelectionMoverService.moveSelection({ x: offset, y: offset });
        }
    }

    private isNextPlacementOutOfDrawing(placementType: PlacementType): boolean {
        const elements = placementType === PlacementType.Clipboard ? this.clipboardBuffer : this.duplicationBuffer;
        const elementsToPlaceRect = this.toolSelectionCollisionService.getElementListBounds(elements) as Rect;
        return (
            elementsToPlaceRect.x + this.getOffset(placementType) + placementPositionOffsetIncrement >= this.drawingService.dimensions.x ||
            elementsToPlaceRect.y + this.getOffset(placementType) + placementPositionOffsetIncrement >= this.drawingService.dimensions.y
        );
    }

    private subscribeToSelectionChanged(): void {
        this.selectionChangedSubscription = this.toolSelectionStateService.selectedElementsChanged$.subscribe(
            (elements: SVGGraphicsElement[]) => {
                // if (elements.length === 0) {
                //     return;
                // }
                this.duplicationBuffer = [...elements];
                this.setOffset(PlacementType.Duplication, 0);
            }
        );
    }
}

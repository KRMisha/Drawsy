import { Injectable } from '@angular/core';
import { ToolSelectionMoverService } from '@app/tools/services/selection/tool-selection-mover.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { DrawingService } from './drawing.service';

const placementPositionOffsetIncrement = 25;

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    private copiedElements: SVGGraphicsElement[] = [];

    private placementPositionOffset = 0;

    constructor(
        private toolSelectionStateService: ToolSelectionStateService,
        private toolSelectionMoverService: ToolSelectionMoverService,
        private drawingService: DrawingService
    ) {}

    copy(): void {
        this.placementPositionOffset = 0;
        this.copiedElements = [];
        for (const element of this.toolSelectionStateService.selectedElements) {
            this.copiedElements.push(element.cloneNode(true) as SVGGraphicsElement);
        }
    }

    paste(): void {
        this.placeElements(this.copiedElements);

        this.placementPositionOffset += placementPositionOffsetIncrement;
        this.toolSelectionMoverService.moveSelection({ x: this.placementPositionOffset, y: this.placementPositionOffset });
    }

    cut(): void {
        this.copy();
        this.delete();
    }

    duplicate(): void {
        const selectedElementsCopy: SVGGraphicsElement[] = [];
        for (const element of this.toolSelectionStateService.selectedElements) {
            selectedElementsCopy.push(element.cloneNode(true) as SVGGraphicsElement);
        }
        this.placeElements(selectedElementsCopy);
        this.toolSelectionMoverService.moveSelection({ x: placementPositionOffsetIncrement, y: placementPositionOffsetIncrement });
    }

    delete(): void {
        for (const element of this.toolSelectionStateService.selectedElements) {
            this.drawingService.removeElement(element);
        }
        this.toolSelectionStateService.selectedElements = [];
    }

    private placeElements(elements: SVGGraphicsElement[]): void {
        for (const element of elements) {
            this.drawingService.addElement(element);
        }
        this.toolSelectionStateService.selectedElements = [...elements];
    }
}

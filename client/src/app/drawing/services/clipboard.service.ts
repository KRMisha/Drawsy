import { Injectable } from '@angular/core';
import { ToolSelectionMoverService } from '@app/tools/services/selection/tool-selection-mover.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionTransformService } from '@app/tools/services/selection/tool-selection-transform.service';
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
        private toolSelectionTransformService: ToolSelectionTransformService,
        private drawingService: DrawingService
    ) {}

    copy(): void {
        this.placementPositionOffset = 0;
        this.copiedElements = [...this.toolSelectionStateService.selectedElements];
    }

    paste(): void {
        this.placeElements(this.copiedElements);
        this.placementPositionOffset += placementPositionOffsetIncrement;
        this.toolSelectionTransformService.initializeElementTransforms(this.toolSelectionStateService.selectedElements);
        this.toolSelectionMoverService.moveSelection({ x: this.placementPositionOffset, y: this.placementPositionOffset });
    }

    cut(): void {
        this.copy();
        this.delete();
    }

    duplicate(): void {
        this.placeElements(this.toolSelectionStateService.selectedElements);
        this.toolSelectionTransformService.initializeElementTransforms(this.toolSelectionStateService.selectedElements);
        this.toolSelectionMoverService.moveSelection({ x: placementPositionOffsetIncrement, y: placementPositionOffsetIncrement });
    }

    delete(): void {
        for (const element of this.toolSelectionStateService.selectedElements) {
            this.drawingService.removeElement(element);
        }
        this.toolSelectionStateService.selectedElements = [];
    }

    private placeElements(elements: SVGGraphicsElement[]): void {
        console.log('a');
        const elementCopies: SVGGraphicsElement[] = [];
        for (const element of elements) {
            const elementCopy = element.cloneNode(true) as SVGGraphicsElement;
            this.drawingService.addElement(elementCopy);
            elementCopies.push(elementCopy);
        }
        this.toolSelectionStateService.selectedElements = elementCopies;
    }
}

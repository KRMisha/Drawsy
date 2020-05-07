import { Pipe, PipeTransform } from '@angular/core';
import { DrawingsSortingType } from '@app/modals/enums/drawings-sorting-type.enum';
import { SvgFileContainer } from '@app/shared/classes/svg-file-container';

@Pipe({
    name: 'drawingsSorting',
    pure: false,
})
export class DrawingsSortingPipe implements PipeTransform {
    transform(drawings: SvgFileContainer[], drawingsSortingType: DrawingsSortingType): SvgFileContainer[] {
        switch (drawingsSortingType) {
            case DrawingsSortingType.Newest:
                return [...drawings].reverse();
            case DrawingsSortingType.Oldest:
                return [...drawings];
            case DrawingsSortingType.Alphabetical:
                return drawings.sort((firstDrawing: SvgFileContainer, secondDrawing: SvgFileContainer) =>
                    firstDrawing.title.localeCompare(secondDrawing.title)
                );
        }
    }
}

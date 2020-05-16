import { Pipe, PipeTransform } from '@angular/core';
import { DrawingSortType } from '@app/modals/enums/drawing-sort-type.enum';
import { SvgFileContainer } from '@app/shared/classes/svg-file-container';

@Pipe({
    name: 'sortDrawings',
    pure: false,
})
export class SortDrawingsPipe implements PipeTransform {
    transform(drawings: SvgFileContainer[], drawingSortType: DrawingSortType): SvgFileContainer[] {
        switch (drawingSortType) {
            case DrawingSortType.Newest:
                return [...drawings].reverse();
            case DrawingSortType.Oldest:
                return [...drawings];
            case DrawingSortType.Alphabetical:
                return drawings.sort((firstDrawing: SvgFileContainer, secondDrawing: SvgFileContainer) =>
                    firstDrawing.title.localeCompare(secondDrawing.title)
                );
        }
    }
}

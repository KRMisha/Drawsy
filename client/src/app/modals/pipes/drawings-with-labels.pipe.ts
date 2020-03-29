import { Pipe, PipeTransform } from '@angular/core';
import { SvgFileContainer } from '@app/shared/classes/svg-file-container';

@Pipe({
    name: 'drawingsWithLabels',
    pure: false,
})
export class DrawingsWithLabelsPipe implements PipeTransform {
    transform(drawings: SvgFileContainer[], labels: string[]): SvgFileContainer[] {
        if (labels.length === 0) {
            return [...drawings].reverse();
        }

        return drawings.filter((drawing: SvgFileContainer) => drawing.labels.some((label: string) => labels.includes(label))).reverse();
    }
}

import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DrawingLoadOptions } from '@app/drawing/classes/drawing-load-options';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { RasterizationService } from '@app/drawing/services/rasterization.service';
import { Color } from '@app/shared/classes/color';
import { SvgFileContainer } from '@app/shared/classes/svg-file-container';

@Injectable({
    providedIn: 'root',
})
export class DrawingSerializerService {
    private renderer: Renderer2;

    constructor(rendererFactory: RendererFactory2, private rasterizationService: RasterizationService) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    serializeDrawing(drawingRoot: SVGSVGElement): string {
        const xmlSerializer = new XMLSerializer();
        return xmlSerializer.serializeToString(drawingRoot);
    }

    deserializeDrawing(serializedDrawingRoot: string, id?: string): SvgFileContainer {
        const domParser = new DOMParser();
        const document = domParser.parseFromString(serializedDrawingRoot, 'image/svg+xml');
        const drawingRoot = document.getElementsByTagName('svg')[0];
        const title = drawingRoot.getElementsByTagName('title')[0].innerHTML;
        const labelsString = drawingRoot.getElementsByTagName('desc')[0].innerHTML;
        const labels = labelsString.length === 0 ? [] : labelsString.split(',');
        return { id, title, labels, drawingRoot } as SvgFileContainer;
    }

    getDrawingLoadOptions(svgFileContainer: SvgFileContainer): DrawingLoadOptions {
        const backgroundRectFillString = svgFileContainer.drawingRoot.getElementsByTagName('rect')[0].getAttribute('fill');
        const backgroundRectFill = Color.fromRgbaString(backgroundRectFillString ?? 'rgb(255, 255, 255)');

        const svgDrawingContent = svgFileContainer.drawingRoot.getElementsByTagName('g')[0];
        const elements: SVGGraphicsElement[] = [];
        for (const element of Array.from(svgDrawingContent.children)) {
            elements.push(element.cloneNode(true) as SVGGraphicsElement);
        }

        const drawingLoadOptions: DrawingLoadOptions = {
            dimensions: { x: svgFileContainer.drawingRoot.viewBox.baseVal.width, y: svgFileContainer.drawingRoot.viewBox.baseVal.height },
            backgroundColor: backgroundRectFill,
            drawingData: {
                id: svgFileContainer.id,
                title: svgFileContainer.title,
                labels: svgFileContainer.labels,
                elements,
            },
        };
        return drawingLoadOptions;
    }

    exportDrawing(drawingRoot: SVGSVGElement, filename: string, fileType: FileType): void {
        fileType === FileType.Svg
            ? this.exportVectorDrawing(drawingRoot, filename)
            : this.exportRasterDrawing(drawingRoot, filename, fileType);
    }

    private exportVectorDrawing(drawingRoot: SVGSVGElement, filename: string): void {
        const fileExtension = '.svg';

        const serializedDrawing = this.serializeDrawing(drawingRoot);
        const blob = new Blob([serializedDrawing], { type: 'image/svg+xml' });

        const link = this.renderer.createElement('a');
        link.download = filename + fileExtension;
        link.href = window.URL.createObjectURL(blob);
        link.click();
    }

    private async exportRasterDrawing(drawingRoot: SVGSVGElement, filename: string, fileType: FileType): Promise<void> {
        const fileExtension = fileType === FileType.Png ? '.png' : '.jpeg';
        const mimeType = fileType === FileType.Png ? 'image/png' : 'image/jpeg';

        const canvas = await this.rasterizationService.getCanvasFromSvgRoot(drawingRoot);

        const link = this.renderer.createElement('a');
        link.download = filename + fileExtension;
        link.href = canvas.toDataURL(mimeType);
        link.click();
    }
}

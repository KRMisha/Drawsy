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

    constructor(
        rendererFactory: RendererFactory2,
        private rasterizationService: RasterizationService
    ) {
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
        const elements = Array.from(svgDrawingContent.children).map(
            (element: SVGGraphicsElement) => element.cloneNode(true) as SVGGraphicsElement
        );

        const drawingLoadOptions: DrawingLoadOptions = {
            dimensions: {
                x: svgFileContainer.drawingRoot.viewBox.baseVal.width,
                y: svgFileContainer.drawingRoot.viewBox.baseVal.height,
            },
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

    async downloadDrawing(drawingRoot: SVGSVGElement, filename: string, fileType: FileType): Promise<void> {
        const blob = await this.exportAsBlob(drawingRoot, fileType);

        const link = this.renderer.createElement('a');
        link.download = filename + '.' + fileType;
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.click();
        window.URL.revokeObjectURL(url);
    }

    async exportAsBlob(drawingRoot: SVGSVGElement, fileType: FileType): Promise<Blob> {
        const blob =
            fileType === FileType.Svg
                ? this.convertVectorDrawingToBlob(drawingRoot)
                : await this.convertRasterDrawingToBlob(drawingRoot, fileType);
        return blob;
    }

    private convertVectorDrawingToBlob(drawingRoot: SVGSVGElement): Blob {
        const serializedDrawing = this.serializeDrawing(drawingRoot);
        return new Blob([serializedDrawing], { type: 'image/svg+xml' });
    }

    private async convertRasterDrawingToBlob(drawingRoot: SVGSVGElement, fileType: FileType): Promise<Blob> {
        const canvas = await this.rasterizationService.getCanvasFromSvgRoot(drawingRoot);
        const mimeType = 'image/' + fileType;

        return new Promise<Blob>((resolve: (blob: Blob) => void) => {
            canvas.toBlob((blob: Blob) => {
                resolve(blob);
            }, mimeType);
        });
    }
}

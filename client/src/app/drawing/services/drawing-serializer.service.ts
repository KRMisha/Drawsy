import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { RasterizationService } from '@app/drawing/services/rasterization.service';
import { Color } from '@app/shared/classes/color';
import { SvgFileContainer } from '@app/shared/classes/svg-file-container';
import { Vec2 } from '@app/shared/classes/vec2';
import { SavedFile } from '@common/communication/saved-file';

@Injectable({
    providedIn: 'root',
})
export class DrawingSerializerService {
    private renderer: Renderer2;

    constructor(
        rendererFactory: RendererFactory2,
        private drawingService: DrawingService,
        private rasterizationService: RasterizationService
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    makeSvgFileContainerFromSavedFile(savedFile: SavedFile): SvgFileContainer {
        const svgFileContainer = this.makeSvgFileContainerFromString(savedFile.content);
        svgFileContainer.id = savedFile.id;
        return svgFileContainer;
    }

    loadDrawing(svgFileContainer: SvgFileContainer): boolean {
        const dimensions: Vec2 = {
            x: svgFileContainer.drawingRoot.viewBox.baseVal.width,
            y: svgFileContainer.drawingRoot.viewBox.baseVal.height,
        };

        const backgroundRectFillString = svgFileContainer.drawingRoot.getElementsByTagName('rect')[0].getAttribute('fill');
        const backgroundColor = Color.fromRgbaString(backgroundRectFillString || 'rgb(255, 255, 255)');

        const [id, title, labels] = [svgFileContainer.id, svgFileContainer.title, svgFileContainer.labels];

        const svgDrawingContent = svgFileContainer.drawingRoot.getElementsByTagName('g')[0];
        const elements: SVGGraphicsElement[] = [];
        for (const element of Array.from(svgDrawingContent.children)) {
            elements.push(element.cloneNode(true) as SVGGraphicsElement);
        }

        return this.drawingService.loadDrawing(dimensions, backgroundColor, id, title, labels, elements);
    }

    exportDrawing(drawingRoot: SVGSVGElement, filename: string, fileType: FileType): void {
        fileType === FileType.Svg
            ? this.exportVectorDrawing(drawingRoot, filename)
            : this.exportRasterDrawing(drawingRoot, filename, fileType);
    }

    private makeSvgFileContainerFromString(content: string): SvgFileContainer {
        const domParser = new DOMParser();
        const document = domParser.parseFromString(content, 'image/svg+xml');
        const parsedDrawingRoot = document.getElementsByTagName('svg')[0];
        const parsedTitle = parsedDrawingRoot.getElementsByTagName('title')[0].innerHTML;
        const parsedLabelsString = parsedDrawingRoot.getElementsByTagName('desc')[0].innerHTML;
        const parsedLabels = parsedLabelsString.length === 0 ? [] : parsedLabelsString.split(',');
        return { id: '', title: parsedTitle, labels: parsedLabels, drawingRoot: parsedDrawingRoot } as SvgFileContainer;
    }

    private exportVectorDrawing(drawingRoot: SVGSVGElement, filename: string): void {
        const fileExtension = '.svg';

        const xmlSerializer = new XMLSerializer();
        const content = xmlSerializer.serializeToString(drawingRoot);
        const blob = new Blob([content], { type: 'image/svg+xml' });

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

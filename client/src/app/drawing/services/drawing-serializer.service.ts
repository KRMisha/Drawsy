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

        // Imported format will always have rect with fill because the format is controlled
        // tslint:disable-next-line: no-non-null-assertion
        const backgroundRectFillString = svgFileContainer.drawingRoot.getElementsByTagName('rect')[0].getAttribute('fill')!;
        const backgroundColor = Color.fromRgbaString(backgroundRectFillString);

        if (!this.drawingService.confirmNewDrawing(dimensions, backgroundColor)) {
            return false;
        }

        this.drawingService.id = svgFileContainer.id;
        this.drawingService.title = svgFileContainer.title;
        this.drawingService.labels = svgFileContainer.labels;

        const svgDrawingContent = svgFileContainer.drawingRoot.getElementsByTagName('g')[0];
        for (const element of Array.from(svgDrawingContent.children)) {
            this.drawingService.addElement(element.cloneNode(true) as SVGGraphicsElement);
        }

        return true;
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
            (await fileType) === FileType.Svg
                ? this.convertVectorDrawingToBlob(drawingRoot)
                : this.convertRasterDrawingToBlob(drawingRoot, fileType);
        return blob;
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

    private convertVectorDrawingToBlob(drawingRoot: SVGSVGElement): Blob {
        const xmlSerializer = new XMLSerializer();
        const content = xmlSerializer.serializeToString(drawingRoot);
        return new Blob([content], { type: 'image/svg+xml' });
    }

    private async convertRasterDrawingToBlob(drawingRoot: SVGSVGElement, fileType: FileType): Promise<Blob> {
        const canvas = await this.rasterizationService.getCanvasFromSvgRoot(drawingRoot);
        const mimeType = fileType === FileType.Png ? 'image/png' : 'image/jpeg';

        return new Promise<Blob>((resolve: (blob: Blob) => void): void => {
            canvas.toBlob((blob: Blob) => {
                resolve(new Blob([blob], { type: mimeType }));
            }, mimeType);
        });
    }
}

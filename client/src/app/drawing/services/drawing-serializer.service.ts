import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { SvgFileContainer } from '@app/classes/svg-file-container';
import { Vec2 } from '@app/classes/vec2';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { SvgUtilityService } from '@app/drawing/services/svg-utility.service';
import { SavedFile } from '@common/communication/saved-file';

@Injectable({
    providedIn: 'root',
})
export class DrawingSerializerService {
    private renderer: Renderer2;

    constructor(
        private drawingService: DrawingService,
        private drawingPreviewService: DrawingPreviewService,
        private svgUtilityService: SvgUtilityService,
        private rendererFactory: RendererFactory2
    ) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
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
            this.drawingService.addElement(element.cloneNode(true) as SVGElement);
        }

        return true;
    }

    exportDrawing(filename: string, fileType: FileType): void {
        fileType === FileType.Svg ? this.exportVectorDrawing(filename) : this.exportMatrixDrawing(filename, fileType);
    }

    private makeSvgFileContainerFromString(content: string): SvgFileContainer {
        const domParser = new DOMParser();
        const document = domParser.parseFromString(content, 'image/svg+xml');
        const parsedDrawingRoot = document.getElementsByTagName('svg')[0];
        const parsedTitle = parsedDrawingRoot.getElementsByTagName('title')[0].innerHTML;
        const parsedLabels = parsedDrawingRoot.getElementsByTagName('desc')[0].innerHTML.split(',');
        return { id: '', title: parsedTitle, labels: parsedLabels, drawingRoot: parsedDrawingRoot } as SvgFileContainer;
    }

    private exportVectorDrawing(filename: string): void {
        const fileExtension = '.svg';

        const xmlSerializer = new XMLSerializer();
        const content = xmlSerializer.serializeToString(this.drawingPreviewService.drawingPreviewRoot);
        const blob = new Blob([content], { type: 'image/svg+xml' });

        const link = this.renderer.createElement('a');
        link.download = filename + fileExtension;
        link.href = window.URL.createObjectURL(blob);
        link.click();
    }

    private async exportMatrixDrawing(filename: string, fileType: FileType): Promise<void> {
        const fileExtension = fileType === FileType.Png ? '.png' : '.jpeg';
        const mimeType = fileType === FileType.Png ? 'image/png' : 'image/jpeg';

        const canvas = await this.svgUtilityService.getCanvasFromSvgRoot(this.drawingPreviewService.drawingPreviewRoot);

        const link = this.renderer.createElement('a');
        link.download = filename + fileExtension;
        link.href = canvas.toDataURL(mimeType);
        link.click();
    }
}

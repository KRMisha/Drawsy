import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { SvgFileContainer } from '@app/classes/svg-file-container';
import { Vec2 } from '@app/classes/vec2';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { SvgUtilityService } from '@app/drawing/services/svg-utility.service';
import { SavedFile } from '../../../../../common/communication/saved-file';

@Injectable({
    providedIn: 'root',
})
export class DrawingSerializerService {
    private renderer: Renderer2;

    constructor(
        private drawingService: DrawingService,
        private drawingPreviewService: DrawingPreviewService,
        private svgUtilitiesService: SvgUtilityService,
        private rendererFactory: RendererFactory2
    ) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    exportDrawingAsSvg(filename: string): void {
        const xmlSerializer = new XMLSerializer();
        const content = xmlSerializer.serializeToString(this.drawingPreviewService.drawingPreviewRoot);
        const blob = new Blob([content], { type: 'image/svg+xml' });

        const link = this.renderer.createElement('a');
        link.download = filename + '.svg';
        link.href = window.URL.createObjectURL(blob);
        link.click();
    }

    async exportDrawing(filename: string, fileType: 'image/png' | 'image/jpeg'): Promise<void> {
        const link = this.renderer.createElement('a');
        link.download = filename;
        const canvas = await this.svgUtilitiesService.getCanvasFromSvgRoot(this.drawingPreviewService.drawingPreviewRoot);
        link.href = canvas.toDataURL(fileType);
        link.click();
    }

    convertSavedFileToSvgFileContainer(savedFile: SavedFile): SvgFileContainer {
        const svgFileContainer = this.svgFileContainerFromString(savedFile.content);
        svgFileContainer.id = savedFile.id;
        return svgFileContainer;
    }

    loadSvgDrawing(svgFileContainer: SvgFileContainer): boolean {
        const dimensions: Vec2 = {
            x: svgFileContainer.drawingRoot.viewBox.baseVal.width,
            y: svgFileContainer.drawingRoot.viewBox.baseVal.height,
        };

        const backgroundRectFillString = svgFileContainer.drawingRoot.getElementsByTagName('rect')[0].getAttribute('fill') as string;
        const backgroundColor = Color.fromRgbaString(backgroundRectFillString);

        if (!this.drawingService.confirmNewDrawing(dimensions, backgroundColor)) {
            return false;
        }

        this.drawingService.id = svgFileContainer.id;
        this.drawingService.labels = svgFileContainer.labels;
        this.drawingService.title = svgFileContainer.title;

        const svgDrawingContent = svgFileContainer.drawingRoot.getElementsByTagName('g')[0];
        for (const element of Array.from(svgDrawingContent.children)) {
            const elementClone = element.cloneNode(true);
            this.drawingService.addElement(elementClone as SVGElement);
        }

        return true;
    }

    async importSvgDrawing(file: File): Promise<SvgFileContainer> {
        const fileContent = await this.readFile(file);

        return this.svgFileContainerFromString(fileContent);
    }

    private async readFile(file: File): Promise<string> {
        return new Promise<string>((resolve: (fileContent: string) => void): void => {
            const fileReader: FileReader = new FileReader();
            fileReader.onload = () => {
                resolve(fileReader.result as string);
            };
            fileReader.readAsText(file);
        });
    }

    private svgFileContainerFromString(content: string): SvgFileContainer {
        const domParser = new DOMParser();
        const document = domParser.parseFromString(content, 'image/svg+xml');
        const importedDrawingRoot = document.getElementsByTagName('svg')[0];
        const importedTitle = importedDrawingRoot.getElementsByTagName('title')[0].innerHTML;
        const importedLabels = importedDrawingRoot.getElementsByTagName('desc')[0].innerHTML.split(',');
        const penis = { title: importedTitle, labels: importedLabels, drawingRoot: importedDrawingRoot, id: '' } as SvgFileContainer;
        return penis;
    }
}

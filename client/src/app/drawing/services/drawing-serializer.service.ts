import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { SvgFileContainer } from '@app/classes/svg-file-container';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { SavedFile } from '../../../../../common/communication/saved-file';
import { SvgUtilitiesService } from './svg-utilities.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingSerializerService {
    private renderer: Renderer2;

    constructor(
        private drawingService: DrawingService,
        private drawingPreviewService: DrawingPreviewService,
        private svgUtilitiesService: SvgUtilitiesService,
        private rendererFactory: RendererFactory2,
    ) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    exportDrawingAsSvg(fileName: string): void {
        const xmlSerializer = new XMLSerializer();
        const content = xmlSerializer.serializeToString(this.drawingPreviewService.drawingPreviewRoot);
        const blob = new Blob([content], { type: 'image/svg+xml' });

        const link = this.renderer.createElement('a');
        link.download = fileName + '.svg';
        link.href = window.URL.createObjectURL(blob);
        link.click();
    }

    convertSavedFileToSvgFileContainer(savedFile: SavedFile): SvgFileContainer {
        const svgFileContainer = this.svgFileContainerFromString(savedFile.content);
        svgFileContainer.id = savedFile.id;
        return svgFileContainer;
    }

    loadSvgDrawing(svgFileContainer: SvgFileContainer): void {
        this.drawingService.dimensions.x = svgFileContainer.drawingRoot.viewBox.baseVal.width;
        this.drawingService.dimensions.y = svgFileContainer.drawingRoot.viewBox.baseVal.height;

        const backgroundRectFillString = svgFileContainer.drawingRoot.getElementsByTagName('rect')[0].getAttribute('fill') as string;

        this.drawingService.backgroundColor = Color.fromRgbaString(backgroundRectFillString);

        this.drawingService.clearStoredElements();
        const svgDrawingContent = svgFileContainer.drawingRoot.getElementsByTagName('g')[0];
        for (const element of Array.from(svgDrawingContent.children)) {
            this.drawingService.addElement(element as SVGElement);
        }
    }

    async exportDrawing(fileName: string, fileType: string): Promise<void> {
        const link = this.renderer.createElement('a');
        link.download = fileName;
        const canvas = await this.svgUtilitiesService.getCanvasFromSvgRoot(this.drawingPreviewService.drawingPreviewRoot);
        link.href = canvas.toDataURL(fileType);
        link.click();
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
        console.log(penis);
        return penis;
    }
}

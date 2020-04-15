import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class RasterizationService {
    private renderer: Renderer2;

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    async getCanvasFromSvgRoot(drawingRoot: SVGSVGElement): Promise<HTMLCanvasElement> {
        const canvas: HTMLCanvasElement = this.renderer.createElement('canvas');
        this.renderer.setAttribute(canvas, 'width', drawingRoot.viewBox.baseVal.width.toString());
        this.renderer.setAttribute(canvas, 'height', drawingRoot.viewBox.baseVal.height.toString());

        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        const image = await this.getImageFromSvgRoot(drawingRoot);
        context.drawImage(image, 0, 0);
        return canvas;
    }

    getPixelColor(data: Uint8ClampedArray, canvasWidth: number, pixelPosition: Vec2): Color {
        const colorValuesCount = 4;
        const colorIndex = pixelPosition.y * (canvasWidth * colorValuesCount) + pixelPosition.x * colorValuesCount;

        const rgbaComponents: number[] = [];
        for (let i = 0; i < colorValuesCount; i++) {
            rgbaComponents.push(data[colorIndex + i]);
        }
        const [red, green, blue, alpha] = rgbaComponents;
        return Color.fromRgba(red, green, blue, alpha / Color.maxRgb);
    }

    private async getImageFromSvgRoot(drawingRoot: SVGSVGElement): Promise<HTMLImageElement> {
        const svg64 = btoa(drawingRoot.outerHTML);
        const image = new Image();
        return new Promise<HTMLImageElement>((resolve: (image: HTMLImageElement) => void): void => {
            image.onload = () => {
                resolve(image);
            };
            image.src = 'data:image/svg+xml;base64,' + svg64;
        });
    }
}

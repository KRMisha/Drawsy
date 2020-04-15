import { Renderer2, RendererFactory2 } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { RasterizationService } from '@app/drawing/services/rasterization.service';

// tslint:disable: no-empty
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('DrawingSerializerService', () => {
    let service: DrawingSerializerService;
    let rendererFactory2SpyObj: jasmine.SpyObj<RendererFactory2>;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let canvasSpyObj: jasmine.SpyObj<HTMLCanvasElement>;
    let rasterizationServiceSpyObj: jasmine.SpyObj<RasterizationService>;
    let anchorMock: HTMLAnchorElement;
    let anchorClickSpy: jasmine.Spy;
    const urlMock = 'http://test-url.com/resource';

    const drawingPreviewRootStub = {} as SVGSVGElement;

    beforeEach(() => {
        anchorMock = ({
            click: () => {},
            download: '',
            href: '',
        } as unknown) as HTMLAnchorElement;
        anchorClickSpy = spyOn(anchorMock, 'click');

        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement']);
        renderer2SpyObj.createElement.and.returnValue(anchorMock);

        rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['loadDrawing', 'addElement']);

        canvasSpyObj = jasmine.createSpyObj('HTMLCanvasElement', ['toDataURL']);
        canvasSpyObj.toDataURL.and.returnValue(urlMock);

        rasterizationServiceSpyObj = jasmine.createSpyObj('RasterizationService', ['getCanvasFromSvgRoot']);
        rasterizationServiceSpyObj.getCanvasFromSvgRoot.and.returnValue(Promise.resolve(canvasSpyObj));

        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: RasterizationService, useValue: rasterizationServiceSpyObj },
            ],
        });

        service = TestBed.inject(DrawingSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#constructor should create a renderer with the renderer factory', () => {
        expect(rendererFactory2SpyObj.createRenderer).toHaveBeenCalledWith(null, null);
        expect(service['renderer']).toBe(renderer2SpyObj);
    });

    it('#exportDrawing should trigger a download for a serialized SVG if the file type is SVG', () => {
        const contentMock = 'Serialized content';
        const xmlSerializerSpyObj = jasmine.createSpyObj('XMLSerializer', ['serializeToString']);
        xmlSerializerSpyObj.serializeToString.and.returnValue(contentMock);

        spyOn(window, 'XMLSerializer').and.returnValue(xmlSerializerSpyObj);

        const blobMock = new Blob(['Blob content']);
        const blobSpy = spyOn(window, 'Blob').and.returnValue(blobMock);

        const createObjUrlSpy = spyOn(window.URL, 'createObjectURL').and.returnValue(urlMock);

        const filenameValue = 'filename';

        service.downloadDrawing(drawingPreviewRootStub, filenameValue, FileType.Svg);
        expect(xmlSerializerSpyObj.serializeToString).toHaveBeenCalledWith(drawingPreviewRootStub);
        expect(blobSpy).toHaveBeenCalledWith([contentMock], { type: 'image/svg+xml' });
        expect(renderer2SpyObj.createElement).toHaveBeenCalledWith('a');
        expect(anchorMock.download).toEqual(filenameValue + '.svg');
        expect(createObjUrlSpy).toHaveBeenCalledWith(blobMock);
        expect(anchorMock.href).toEqual(urlMock);
        expect(anchorClickSpy).toHaveBeenCalled();
    });

    it('#exportDrawing should trigger a download for a PNG if the file type is PNG', fakeAsync(() => {
        const filenameValue = 'filename';

        service.downloadDrawing(drawingPreviewRootStub, filenameValue, FileType.Png);
        tick();
        expect(renderer2SpyObj.createElement).toHaveBeenCalledWith('a');
        expect(anchorMock.download).toEqual(filenameValue + '.png');
        expect(canvasSpyObj.toDataURL).toHaveBeenCalledWith('image/png');
        expect(anchorMock.href).toEqual(urlMock);
        expect(anchorClickSpy).toHaveBeenCalled();
    }));

    it('#exportDrawing should trigger a download for a JPEG if the file type is JPEG', fakeAsync(() => {
        const filenameValue = 'filename';

        service.downloadDrawing(drawingPreviewRootStub, filenameValue, FileType.Jpeg);
        tick();
        expect(renderer2SpyObj.createElement).toHaveBeenCalledWith('a');
        expect(anchorMock.download).toEqual(filenameValue + '.jpeg');
        expect(canvasSpyObj.toDataURL).toHaveBeenCalledWith('image/jpeg');
        expect(anchorMock.href).toEqual(urlMock);
        expect(anchorClickSpy).toHaveBeenCalled();
    }));
});

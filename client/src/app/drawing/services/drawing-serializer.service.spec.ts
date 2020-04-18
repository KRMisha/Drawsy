import { Renderer2, RendererFactory2 } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DrawingLoadOptions } from '@app/drawing/classes/drawing-load-options';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { RasterizationService } from '@app/drawing/services/rasterization.service';
import { Color } from '@app/shared/classes/color';
import { SvgFileContainer } from '@app/shared/classes/svg-file-container';
import { SavedFile } from '@common/communication/saved-file';

// tslint:disable: no-any
// tslint:disable: no-empty
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('DrawingSerializerService', () => {
    let service: DrawingSerializerService;
    let rendererFactory2SpyObj: jasmine.SpyObj<RendererFactory2>;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let rasterizationServiceSpyObj: jasmine.SpyObj<RasterizationService>;

    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement']);

        rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['loadDrawing', 'addElement']);

        rasterizationServiceSpyObj = jasmine.createSpyObj('RasterizationService', ['getCanvasFromSvgRoot']);

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

    it('#serializeDrawing should return the string of the serialized XMLElement passed as a parameter', () => {
        const xmlElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const expectedString = '<svg xmlns="http://www.w3.org/2000/svg"/>';
        expect(service.serializeDrawing(xmlElement)).toEqual(expectedString);
    });

    it('#deserializeDrawing should return a SvgFileContainer with the provided ID', () => {
        const svgElementSpyObj1 = jasmine.createSpyObj('SVGElement', [], {
            innerHTML: 'Title',
        });
        const svgElementSpyObj2 = jasmine.createSpyObj('SVGElement', [], {
            innerHTML: 'I,love,testing',
        });

        const parsedDrawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getElementsByTagName']);
        parsedDrawingRootSpyObj.getElementsByTagName.and.callFake((tag: string) => {
            if (tag === 'title') {
                return [svgElementSpyObj1];
            } else {
                return [svgElementSpyObj2];
            }
        });

        const documentSpyObj = jasmine.createSpyObj('Document', ['getElementsByTagName']);
        documentSpyObj.getElementsByTagName.and.returnValue([parsedDrawingRootSpyObj]);

        const domParserSpyObj = jasmine.createSpyObj('DOMParser', ['parseFromString']);
        domParserSpyObj.parseFromString.and.returnValue(documentSpyObj);

        spyOn(window, 'DOMParser').and.returnValue(domParserSpyObj);

        const savedFileMock: SavedFile = { id: 'ID', content: 'content' };
        const expectedValue: SvgFileContainer = {
            id: 'ID',
            title: 'Title',
            labels: ['I', 'love', 'testing'],
            drawingRoot: parsedDrawingRootSpyObj,
        };

        const actualValue = service.deserializeDrawing(savedFileMock.content, 'ID');
        expect(actualValue).toEqual(expectedValue);
    });

    it('#deserializeDrawing should return a SvgFileContainer with an undefined ID if none are provided', () => {
        const svgElementSpyObj1 = jasmine.createSpyObj('SVGElement', [], {
            innerHTML: 'Title',
        });
        const svgElementSpyObj2 = jasmine.createSpyObj('SVGElement', [], {
            innerHTML: '',
        });

        const parsedDrawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getElementsByTagName']);
        parsedDrawingRootSpyObj.getElementsByTagName.and.callFake((tag: string) => {
            if (tag === 'title') {
                return [svgElementSpyObj1];
            } else {
                return [svgElementSpyObj2];
            }
        });

        const documentSpyObj = jasmine.createSpyObj('Document', ['getElementsByTagName']);
        documentSpyObj.getElementsByTagName.and.returnValue([parsedDrawingRootSpyObj]);

        const domParserSpyObj = jasmine.createSpyObj('DOMParser', ['parseFromString']);
        domParserSpyObj.parseFromString.and.returnValue(documentSpyObj);

        spyOn(window, 'DOMParser').and.returnValue(domParserSpyObj);

        const savedFileMock: SavedFile = { id: 'ID', content: 'content' };
        const expectedValue: SvgFileContainer = {
            id: (undefined as unknown) as string,
            title: 'Title',
            labels: [],
            drawingRoot: parsedDrawingRootSpyObj,
        };
        const actualValue = service.deserializeDrawing(savedFileMock.content);
        expect(actualValue).toEqual(expectedValue);
    });

    it('#getDrawingLoadOptions should parse the svgFileContainer and return its associated DrawingLoadOptions with default color if none are parsed', () => {
        const svgElementSpyObj1 = jasmine.createSpyObj('SVGElement', ['cloneNode']);
        const svgElementSpyObj2 = jasmine.createSpyObj('SVGElement', ['cloneNode']);
        svgElementSpyObj2.cloneNode.and.returnValue(svgElementSpyObj1);

        const svgRectElementSpyObj = jasmine.createSpyObj('SVGRectElement', ['getAttribute']);

        const expectedWidth = 10;
        const expectedHeight = 10;

        const svgSvgElementStub = ({ children: [svgElementSpyObj2, svgElementSpyObj2] } as unknown) as SVGSVGElement;

        const parsedDrawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getElementsByTagName'], {
            viewBox: {
                baseVal: {
                    width: expectedWidth,
                    height: expectedHeight,
                },
            },
        });
        parsedDrawingRootSpyObj.getElementsByTagName.and.callFake((tag: string) => {
            if (tag === 'rect') {
                return [svgRectElementSpyObj];
            } else {
                return [svgSvgElementStub];
            }
        });
        const expectedBackgroundColor = {} as Color;
        const fromRgbaStringSpy = spyOn(Color, 'fromRgbaString').and.returnValue(expectedBackgroundColor);

        const expectedId = 'penis';
        const expectedTitle = 'pipi';
        const expectedLabels = ['please', 'its', 'almost', 'done'];
        const svgFileContainer: SvgFileContainer = {
            drawingRoot: parsedDrawingRootSpyObj,
            id: expectedId,
            title: expectedTitle,
            labels: expectedLabels,
        };

        const expectedDrawingLoadOptions: DrawingLoadOptions = {
            dimensions: { x: expectedWidth, y: expectedHeight },
            backgroundColor: expectedBackgroundColor,
            drawingData: {
                id: expectedId,
                title: expectedTitle,
                labels: expectedLabels,
                elements: [svgElementSpyObj1, svgElementSpyObj1],
            },
        };

        const actualDrawingLoadOptions = service.getDrawingLoadOptions(svgFileContainer);
        expect(actualDrawingLoadOptions).toEqual(expectedDrawingLoadOptions);
        expect(fromRgbaStringSpy).toHaveBeenCalledWith('rgb(255, 255, 255)');
    });

    it('#getDrawingLoadOptions should parse the svgFileContainer and return its associated DrawingLoadOptions with corresponding backgroudColor ', () => {
        const svgElementSpyObj1 = jasmine.createSpyObj('SVGElement', ['cloneNode']);
        const svgElementSpyObj2 = jasmine.createSpyObj('SVGElement', ['cloneNode']);
        svgElementSpyObj2.cloneNode.and.returnValue(svgElementSpyObj1);

        const backgroundFillString = 'drawsy.io';
        const svgRectElementSpyObj = jasmine.createSpyObj('SVGRectElement', ['getAttribute']);
        svgRectElementSpyObj.getAttribute.and.returnValue(backgroundFillString);
        const expectedWidth = 10;
        const expectedHeight = 10;

        const svgSvgElementStub = ({ children: [svgElementSpyObj2, svgElementSpyObj2] } as unknown) as SVGSVGElement;

        const parsedDrawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getElementsByTagName'], {
            viewBox: {
                baseVal: {
                    width: expectedWidth,
                    height: expectedHeight,
                },
            },
        });
        parsedDrawingRootSpyObj.getElementsByTagName.and.callFake((tag: string) => {
            if (tag === 'rect') {
                return [svgRectElementSpyObj];
            } else {
                return [svgSvgElementStub];
            }
        });
        const expectedBackgroundColor = {} as Color;
        const fromRgbaStringSpy = spyOn(Color, 'fromRgbaString').and.returnValue(expectedBackgroundColor);

        const expectedId = 'penis';
        const expectedTitle = 'pipi';
        const expectedLabels = ['please', 'its', 'almost', 'done'];
        const svgFileContainer: SvgFileContainer = {
            drawingRoot: parsedDrawingRootSpyObj,
            id: expectedId,
            title: expectedTitle,
            labels: expectedLabels,
        };

        const expectedDrawingLoadOptions: DrawingLoadOptions = {
            dimensions: { x: expectedWidth, y: expectedHeight },
            backgroundColor: expectedBackgroundColor,
            drawingData: {
                id: expectedId,
                title: expectedTitle,
                labels: expectedLabels,
                elements: [svgElementSpyObj1, svgElementSpyObj1],
            },
        };

        const actualDrawingLoadOptions = service.getDrawingLoadOptions(svgFileContainer);
        expect(actualDrawingLoadOptions).toEqual(expectedDrawingLoadOptions);
        expect(fromRgbaStringSpy).toHaveBeenCalledWith(backgroundFillString);
    });

    it('#downloadDrawing should trigger a download for a serialized SVG if the file type is SVG', fakeAsync(() => {
        const expectedBlob = new Blob(['blob content']);
        const expectedUrl = 'drawsy.io';
        const anchorMock = ({
            click: () => {},
            download: '',
            href: '',
        } as unknown) as HTMLAnchorElement;
        const createObjectUrlSpy = spyOn(window.URL, 'createObjectURL').and.returnValue(expectedUrl);
        const revokeObjectUrlSpy = spyOn(window.URL, 'revokeObjectURL');
        const exportAsBlobSpy = spyOn(service, 'exportAsBlob').and.returnValue(Promise.resolve(expectedBlob));
        const clickSpy = spyOn(anchorMock, 'click');
        renderer2SpyObj.createElement.and.returnValue(anchorMock);

        const filename = 'mishaWithFilters';
        const fileType = FileType.Svg;
        const drawingRoot = {} as SVGSVGElement;
        service.downloadDrawing(drawingRoot, filename, fileType);
        tick();
        expect(exportAsBlobSpy).toHaveBeenCalledWith(drawingRoot, fileType);
        expect(renderer2SpyObj.createElement).toHaveBeenCalledWith('a');
        expect(anchorMock.download).toEqual(filename + '.' + fileType);
        expect(createObjectUrlSpy).toHaveBeenCalledWith(expectedBlob);
        expect(anchorMock.href).toEqual(expectedUrl);
        expect(clickSpy).toHaveBeenCalled();
        expect(revokeObjectUrlSpy).toHaveBeenCalledWith(expectedUrl);
    }));

    it('#exportAsBlob should return call #convertVectorDrawingToBlob if the fileType is Svg', async () => {
        const drawingRootStub = {} as SVGSVGElement;
        const expectedBlob = new Blob(['blob content']);
        const convertVectorDrawingToBlobSpy = spyOn<any>(service, 'convertVectorDrawingToBlob').and.returnValue(expectedBlob);
        const actualBlob = await service.exportAsBlob(drawingRootStub, FileType.Svg);
        expect(convertVectorDrawingToBlobSpy).toHaveBeenCalledWith(drawingRootStub);
        expect(actualBlob).toBe(expectedBlob);
    });

    it('#exportAsBlob should return call #convertRasterDrawingToBlob if the fileType is different from Svg', fakeAsync(async () => {
        const drawingRootStub = {} as SVGSVGElement;
        const expectedBlob = new Blob(['blob content']);
        const convertRasterDrawingToBlobSpy = spyOn<any>(service, 'convertRasterDrawingToBlob').and.returnValue(
            Promise.resolve(expectedBlob)
        );
        const actualBlob = await service.exportAsBlob(drawingRootStub, FileType.Jpeg);
        tick();
        expect(convertRasterDrawingToBlobSpy).toHaveBeenCalledWith(drawingRootStub, FileType.Jpeg);
        expect(actualBlob).toBe(expectedBlob);
    }));

    it('#convertVectorDrawingToBlob should call #serializeDrawing to create a blob for a vector drawing', () => {
        const serializedString = 'okkkkkk';
        const expectedBlob = {} as Blob;
        const serializeDrawingSpy = spyOn(service, 'serializeDrawing').and.returnValue(serializedString);
        const blobSpy = spyOn(window, 'Blob').and.returnValue(expectedBlob);

        const drawingRootStub = {} as SVGSVGElement;
        const actualBlob = service['convertVectorDrawingToBlob'](drawingRootStub);
        expect(serializeDrawingSpy).toHaveBeenCalledWith(drawingRootStub);
        expect(blobSpy).toHaveBeenCalledWith([serializedString], { type: 'image/svg+xml' });
        expect(actualBlob).toBe(expectedBlob);
    });

    it('#convertRasterDrawingToBlob should return the return value of the #toBlob method of canvas in a promise wrapper', async () => {
        const canvasStub = document.createElement('canvas');
        const toBlobSpy = spyOn(canvasStub, 'toBlob').and.callThrough();
        rasterizationServiceSpyObj.getCanvasFromSvgRoot.and.returnValue(Promise.resolve(canvasStub));
        await service['convertRasterDrawingToBlob']({} as SVGSVGElement, FileType.Jpeg);
        expect(rasterizationServiceSpyObj.getCanvasFromSvgRoot).toHaveBeenCalled();
        expect(toBlobSpy).toHaveBeenCalled();
    });
});

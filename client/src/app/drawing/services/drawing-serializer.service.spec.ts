import { Renderer2, RendererFactory2 } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { SvgUtilityService } from '@app/drawing/services/svg-utility.service';
import { Color } from '@app/shared/classes/color';
import { SvgFileContainer } from '@app/shared/classes/svg-file-container';
import { Vec2 } from '@app/shared/classes/vec2';
import { SavedFile } from '@common/communication/saved-file';

// tslint:disable: no-empty
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('DrawingSerializerService', () => {
    let service: DrawingSerializerService;
    let rendererFactory2SpyObj: jasmine.SpyObj<RendererFactory2>;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let canvasSpyObj: jasmine.SpyObj<HTMLCanvasElement>;
    let svgUtilityServiceSpyObj: jasmine.SpyObj<SvgUtilityService>;
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

        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['confirmNewDrawing', 'addElement']);

        canvasSpyObj = jasmine.createSpyObj('HTMLCanvasElement', ['toDataURL']);
        canvasSpyObj.toDataURL.and.returnValue(urlMock);

        svgUtilityServiceSpyObj = jasmine.createSpyObj('SvgUtilityService', ['getCanvasFromSvgRoot']);
        svgUtilityServiceSpyObj.getCanvasFromSvgRoot.and.returnValue(Promise.resolve(canvasSpyObj));

        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: SvgUtilityService, useValue: svgUtilityServiceSpyObj },
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

    it('#makeSvgFileContainerFromSavedFile should create a new SvgFileContainer from ID and parsed content of the given SavedFile', () => {
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

        const actualValue = service.makeSvgFileContainerFromSavedFile(savedFileMock);
        expect(actualValue).toEqual(expectedValue);
    });

    it(
        '#makeSvgFileContainerFromSavedFile should create a new SvgFileContainer from ID and parsed content of the given SavedFile ' +
            'with empty labels if the desc tag is empty',
        () => {
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

            const savedFileValue: SavedFile = { id: 'ID', content: 'content' };
            const expectedValue: SvgFileContainer = {
                id: 'ID',
                title: 'Title',
                labels: [],
                drawingRoot: parsedDrawingRootSpyObj,
            };

            const actualValue = service.makeSvgFileContainerFromSavedFile(savedFileValue);
            expect(actualValue).toEqual(expectedValue);
        }
    );

    it('#loadDrawing should load the drawing in the drawing service and return true if the confirmation is accepted', () => {
        const drawingServiceMock = ({
            confirmNewDrawing: () => {},
            addElement: () => {},
            id: '',
            title: '',
            labels: [],
        } as unknown) as DrawingService;
        const confirmNewDrawingSpy = spyOn(drawingServiceMock, 'confirmNewDrawing').and.returnValue(true);
        const addElementSpy = spyOn(drawingServiceMock, 'addElement');
        service['drawingService'] = drawingServiceMock;

        const svgRectElementSpyObj = jasmine.createSpyObj('SVGRectElement', ['getAttribute']);

        const backgroundColor = Color.fromRgba(32, 32, 32, 1);
        spyOn(Color, 'fromRgbaString').and.returnValue(backgroundColor);

        const clonedNodeStub = {} as SVGGraphicsElement;
        const svgElementSpyObj = jasmine.createSpyObj('SVGElement', ['cloneNode']);
        svgElementSpyObj.cloneNode.and.returnValue(clonedNodeStub);

        const svgGElementSpyObj = jasmine.createSpyObj('SVGGElement', [], {
            children: [svgElementSpyObj, svgElementSpyObj, svgElementSpyObj],
        });

        const expectedDimensions: Vec2 = { x: 100, y: 200 };
        const drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getElementsByTagName'], {
            viewBox: {
                baseVal: {
                    width: expectedDimensions.x,
                    height: expectedDimensions.y,
                },
            },
        });
        drawingRootSpyObj.getElementsByTagName.and.callFake((tag: string) => {
            if (tag === 'rect') {
                return [svgRectElementSpyObj];
            } else {
                return [svgGElementSpyObj];
            }
        });

        const svgFileContainerValue: SvgFileContainer = {
            id: 'ID',
            title: 'Title',
            labels: ['I', 'love', 'testing'],
            drawingRoot: drawingRootSpyObj,
        };

        const returnedValue = service.loadDrawing(svgFileContainerValue);
        expect(confirmNewDrawingSpy).toHaveBeenCalledWith(expectedDimensions, backgroundColor);
        expect(drawingServiceMock.id).toEqual(svgFileContainerValue.id);
        expect(drawingServiceMock.title).toEqual(svgFileContainerValue.title);
        expect(drawingServiceMock.labels).toEqual(svgFileContainerValue.labels);
        expect(addElementSpy).toHaveBeenCalledTimes(3);
        expect(addElementSpy).toHaveBeenCalledWith(clonedNodeStub);
        expect(returnedValue).toEqual(true);
    });

    it('#loadDrawing should not load the drawing in the drawing service and should return false if the confirmation is declined', () => {
        const drawingServiceMock = ({
            confirmNewDrawing: () => {},
            addElement: () => {},
            id: '',
            title: '',
            labels: [],
        } as unknown) as DrawingService;
        const confirmNewDrawingSpy = spyOn(drawingServiceMock, 'confirmNewDrawing').and.returnValue(false);
        const addElementSpy = spyOn(drawingServiceMock, 'addElement');
        service['drawingService'] = drawingServiceMock;

        const svgRectElementSpyObj = jasmine.createSpyObj('SVGRectElement', ['getAttribute']);

        const backgroundColor = Color.fromRgba(32, 32, 32, 1);
        spyOn(Color, 'fromRgbaString').and.returnValue(backgroundColor);

        const expectedDimensions: Vec2 = { x: 100, y: 200 };
        const drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getElementsByTagName'], {
            viewBox: {
                baseVal: {
                    width: expectedDimensions.x,
                    height: expectedDimensions.y,
                },
            },
        });
        drawingRootSpyObj.getElementsByTagName.and.returnValue([svgRectElementSpyObj]);

        const svgFileContainerValue: SvgFileContainer = {
            id: 'ID',
            title: 'Title',
            labels: ['I', 'love', 'testing'],
            drawingRoot: drawingRootSpyObj,
        };

        const returnedValue = service.loadDrawing(svgFileContainerValue);
        expect(confirmNewDrawingSpy).toHaveBeenCalledWith(expectedDimensions, backgroundColor);
        expect(drawingServiceMock.id).not.toEqual(svgFileContainerValue.id);
        expect(drawingServiceMock.title).not.toEqual(svgFileContainerValue.title);
        expect(drawingServiceMock.labels).not.toEqual(svgFileContainerValue.labels);
        expect(addElementSpy).not.toHaveBeenCalled();
        expect(returnedValue).toEqual(false);
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

        service.exportDrawing(drawingPreviewRootStub, filenameValue, FileType.Svg);
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

        service.exportDrawing(drawingPreviewRootStub, filenameValue, FileType.Png);
        tick();
        expect(renderer2SpyObj.createElement).toHaveBeenCalledWith('a');
        expect(anchorMock.download).toEqual(filenameValue + '.png');
        expect(canvasSpyObj.toDataURL).toHaveBeenCalledWith('image/png');
        expect(anchorMock.href).toEqual(urlMock);
        expect(anchorClickSpy).toHaveBeenCalled();
    }));

    it('#exportDrawing should trigger a download for a JPEG if the file type is JPEG', fakeAsync(() => {
        const filenameValue = 'filename';

        service.exportDrawing(drawingPreviewRootStub, filenameValue, FileType.Jpeg);
        tick();
        expect(renderer2SpyObj.createElement).toHaveBeenCalledWith('a');
        expect(anchorMock.download).toEqual(filenameValue + '.jpeg');
        expect(canvasSpyObj.toDataURL).toHaveBeenCalledWith('image/jpeg');
        expect(anchorMock.href).toEqual(urlMock);
        expect(anchorClickSpy).toHaveBeenCalled();
    }));
});

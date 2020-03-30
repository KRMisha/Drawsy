import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingService } from './drawing.service';

fdescribe('DrawingPreviewService', () => {
    let service: DrawingPreviewService;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let svgElementSpyObj: jasmine.SpyObj<SVGGraphicsElement>;
    let filterSpyObj: jasmine.SpyObj<SVGFilterElement>;
    let drawingRootSpyObj: jasmine.SpyObj<SVGSVGElement>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;

    let svgSpyObjElementArray: SVGGraphicsElement[];
    let svgFilterSpyObjArray: SVGFilterElement[];
    const initialTitle = 'Title';
    const initialLabels = ['Label', 'lAbEl', 'please'];

    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['appendChild', 'createText']);
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        svgElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['cloneNode']);
        svgSpyObjElementArray = [svgElementSpyObj, svgElementSpyObj, svgElementSpyObj];

        filterSpyObj = jasmine.createSpyObj('SVGFilterElement', ['cloneNode']);
        svgFilterSpyObjArray = [filterSpyObj, filterSpyObj, filterSpyObj];

        const defsSpyObj = jasmine.createSpyObj('SVGDefsElement', ['getElementsByTagName']);
        defsSpyObj.getElementsByTagName.and.returnValue(svgFilterSpyObjArray);

        drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getElementsByTagName']);
        drawingRootSpyObj.getElementsByTagName.and.returnValue([defsSpyObj] as any); // tslint:disable-line: no-any

        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], {
            drawingRoot: drawingRootSpyObj,
            svgElements: svgSpyObjElementArray,
            title: initialTitle,
            labels: initialLabels,
        });
        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
            ],
        });
        service = TestBed.inject(DrawingPreviewService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#initializePreview should clone every filter and svgElements of the drawingService\'s root', () => {
        service.initializePreview();
        expect(filterSpyObj.cloneNode).toHaveBeenCalledTimes(svgFilterSpyObjArray.length);
        expect(svgElementSpyObj.cloneNode).toHaveBeenCalledTimes(svgSpyObjElementArray.length);
        expect(renderer2SpyObj.appendChild).toHaveBeenCalledTimes(svgFilterSpyObjArray.length + svgSpyObjElementArray.length);
    });

    it('#finalizePreview should append the title and the label to the svg', () => {
        const svgTitleElementStub = {} as SVGTitleElement;
        const svgDescElementStub = {} as SVGDescElement;
        service.svgTitle = svgTitleElementStub;
        service.svgDesc = svgDescElementStub;
        service.finalizePreview();
        expect(renderer2SpyObj.createText).toHaveBeenCalledTimes(2);
        expect(renderer2SpyObj.appendChild).toHaveBeenCalledTimes(2);
    });
});

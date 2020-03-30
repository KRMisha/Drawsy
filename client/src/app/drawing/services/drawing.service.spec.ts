// import { Renderer2 } from '@angular/core';
// import { TestBed } from '@angular/core/testing';
// import { DrawingService } from '@app/drawing/services/drawing.service';

// // tslint:disable: no-magic-numbers

// describe('DrawingService', () => {
//     let service: DrawingService;
//     let rendererSpyObj: jasmine.SpyObj<Renderer2>;

//     beforeEach(() => {
//         rendererSpyObj = jasmine.createSpyObj('renderer2', ['appendChild', 'removeChild']);
//         TestBed.configureTestingModule({
//             providers: [{ provide: Renderer2, useValue: rendererSpyObj }],
//         });
//         service = TestBed.inject(DrawingService);
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('#addElement should append child to renderer', () => {
//         const element = {} as SVGGraphicsElement;
//         service.addElement(element);
//         expect(rendererSpyObj.appendChild).toHaveBeenCalledWith(service.svgDrawingContent, element);
//     });

//     it('#removeElement should append child to renderer', () => {
//         const element = {} as SVGGraphicsElement;
//         service.addElement(element);
//         service.removeElement(element);
//         expect(rendererSpyObj.removeChild).toHaveBeenCalledWith(service.svgDrawingContent, element);
//     });

//     it('#removeElement should do nothing if element does not exist in array', () => {
//         const element = {} as SVGGraphicsElement;
//         service.removeElement(element);
//         expect(rendererSpyObj.removeChild).not.toHaveBeenCalled();
//     });

//     it('#clearStoredElements should remove all items from renderer', () => {
//         for (let i = 0; i < 10; i++) {
//             service.addElement({} as SVGGraphicsElement);
//         }
//         service.clearStoredElements();
//         expect(rendererSpyObj.removeChild).toHaveBeenCalledTimes(10);
//     });

//     it('#clearStoredElements should not remove any elements from renderer if none exist', () => {
//         service.clearStoredElements();
//         expect(rendererSpyObj.removeChild).not.toHaveBeenCalled();
//     });

//     it('#reappendStoredElements should do nothing when no element exist', () => {
//         service.reappendStoredElements();
//         expect(rendererSpyObj.removeChild).not.toHaveBeenCalled();
//         expect(rendererSpyObj.appendChild).not.toHaveBeenCalled();
//     });

//     it('#reappendStoredElements should reappend stored element', () => {
//         for (let i = 0; i < 10; i++) {
//             service.addElement({} as SVGGraphicsElement);
//         }
//         expect(rendererSpyObj.appendChild).toHaveBeenCalledTimes(10);
//         service.reappendStoredElements();
//         expect(rendererSpyObj.appendChild).toHaveBeenCalledTimes(20);
//     });
// });

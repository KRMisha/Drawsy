import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DrawingService } from './drawing.service';

// tslint:disable: max-classes-per-file
// tslint:disable: no-any
// tslint:disable: no-empty
// tslint:disable: no-magic-numbers

describe('DrawingService', () => {
    let service: DrawingService;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.get(DrawingService);
        service.renderer = {
            appendChild: (parent: any, newChild: any) => {},
            removeChild: (parent: any, newChild: any) => {},
        } as Renderer2;
        spyOn(service.renderer, 'appendChild').and.callThrough();
        spyOn(service.renderer, 'removeChild').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#addElement should append child to renderer', () => {
        const element = {} as SVGElement;
        service.addElement(element);
        expect(service.renderer.appendChild).toHaveBeenCalledWith(service.rootElement, element);
    });

    it('#removeElement should append child to renderer', () => {
        const element = {} as SVGElement;
        service.addElement(element);
        service.removeElement(element);
        expect(service.renderer.removeChild).toHaveBeenCalledWith(service.rootElement, element);
    });

    it('#removeElement should do nothing if element does not exist in array', () => {
        const element = {} as SVGElement;
        service.removeElement(element);
        expect(service.renderer.removeChild).not.toHaveBeenCalled();
    });

    it('#clearStoredElements should remove all items from renderer', () => {
        for (let i = 0; i < 10; i++) {
            service.addElement({} as SVGElement);
        }
        service.clearStoredElements();
        expect(service.renderer.removeChild).toHaveBeenCalledTimes(10);
    });

    it('#clearStoredElements should not remove any elements from renderer if none exist', () => {
        service.clearStoredElements();
        expect(service.renderer.removeChild).not.toHaveBeenCalled();
    });

    it('#reappendStoredElements should do nothing when no element exist', () => {
        service.reappendStoredElements();
        expect(service.renderer.removeChild).not.toHaveBeenCalled();
        expect(service.renderer.appendChild).not.toHaveBeenCalled();
    });

    it('#reappendStoredElements should reappend stored element', () => {
        for (let i = 0; i < 10; i++) {
            service.addElement({} as SVGElement);
        }
        expect(service.renderer.appendChild).toHaveBeenCalledTimes(10);
        service.reappendStoredElements();
        expect(service.renderer.appendChild).toHaveBeenCalledTimes(20);
    });
});

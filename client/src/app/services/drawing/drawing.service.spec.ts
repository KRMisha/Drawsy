import { TestBed } from '@angular/core/testing';

import { Renderer2 } from '@angular/core';
import { DrawingService } from './drawing.service';

// tslint:disable: max-classes-per-file
// tslint:disable: no-empty

fdescribe('DrawingService', () => {
    let service: DrawingService;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.get(DrawingService);
        service.renderer = {
            appendChild: (parent: any, newChild: any) => {},
            removeChild: (parent: any, newChild: any) => {},
        } as Renderer2;
        spyOn(service.renderer, 'appendChild');
        spyOn(service.renderer, 'removeChild');
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
        expect(service.renderer.removeChild).toHaveBeenCalledTimes(0);
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
        expect(service.renderer.removeChild).toHaveBeenCalledTimes(0);
    });

    it('#reappendStoredElements should do nothing when no element exist', () => {
        service.reappendStoredElements();
        expect(service.renderer.removeChild).toHaveBeenCalledTimes(0);
        expect(service.renderer.appendChild).toHaveBeenCalledTimes(0);
    });

    it('#reappendStoredElements should re append stored element', () => {
        for (let i = 0; i < 10; i++) {
            service.addElement({} as SVGElement);
        }
        expect(service.renderer.appendChild).toHaveBeenCalledTimes(10);
        service.reappendStoredElements();
        expect(service.renderer.appendChild).toHaveBeenCalledTimes(20);
    })
});

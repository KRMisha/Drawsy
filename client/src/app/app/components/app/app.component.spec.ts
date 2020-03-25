import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppComponent } from '@app/app/components/app/app.component';
import { ModalService } from '@app/modals/services/modal.service';

describe('AppComponent', () => {
    let component: AppComponent;
    let modalServiceSpyObject: jasmine.SpyObj<ModalService>;

    beforeEach(async(() => {
        modalServiceSpyObject = jasmine.createSpyObj('ModalService', ['openNewDrawingModal', 'openGalleryModal']);
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            providers: [{ provide: ModalService, useValue: modalServiceSpyObject}],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        });

        const fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
    }));

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    // it('#onRightClick should prevent the default event', () => {
    //     const event = new MouseEvent('');
    //     spyOn(event, 'preventDefault').and.callThrough();
    //     app.onRightClick(event);
    //     expect(event.preventDefault).toHaveBeenCalled();
    // });

    // it('#onKeyDown CTRL + o should open dialog', () => {
    //     const event = { key: 'o', ctrlKey: true, preventDefault: () => {} } as KeyboardEvent;
    //     app.onKeyDown(event);
    //     expect(modalServiceSpyObject.openDialog).toHaveBeenCalledTimes(1);
    // });

    // it('#onKeyDown anything else than CTRL + o should do nothing', () => {
    //     const event = { key: 'o', ctrlKey: false } as KeyboardEvent;
    //     app.onKeyDown(event);
    //     expect(modalServiceSpyObject.openDialog).not.toHaveBeenCalled();
    // });
});

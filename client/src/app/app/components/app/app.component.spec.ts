// import { HttpClientModule } from '@angular/common/http';
// import { async, TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { AppComponent } from '@app/app/app.component';
// import { ModalService } from '@app/modals/services/modal.service';

// // tslint:disable: max-classes-per-file
// // tslint:disable: no-empty

// describe('AppComponent', () => {
//     let modalServiceSpyObject: jasmine.SpyObj<ModalService>;
//     let app: AppComponent;

//     beforeEach(async(() => {
//         modalServiceSpyObject = jasmine.createSpyObj({
//             openDialog: () => {},
//         });
//         TestBed.configureTestingModule({
//             declarations: [AppComponent],
//             imports: [RouterTestingModule, HttpClientModule],
//             providers: [{ provide: ModalService, useValue: modalServiceSpyObject as ModalService }],
//         });

//         const fixture = TestBed.createComponent(AppComponent);
//         app = fixture.componentInstance;
//     }));

//     it('should create the app', () => {
//         expect(app).toBeTruthy();
//     });

//     it('#onRightClick should prevent the default event', () => {
//         const event = new MouseEvent('');
//         spyOn(event, 'preventDefault').and.callThrough();
//         app.onRightClick(event);
//         expect(event.preventDefault).toHaveBeenCalled();
//     });

//     it('#onKeyDown CTRL + o should open dialog', () => {
//         const event = { key: 'o', ctrlKey: true, preventDefault: () => {} } as KeyboardEvent;
//         app.onKeyDown(event);
//         expect(modalServiceSpyObject.openDialog).toHaveBeenCalledTimes(1);
//     });

//     it('#onKeyDown anything else than CTRL + o should do nothing', () => {
//         const event = { key: 'o', ctrlKey: false } as KeyboardEvent;
//         app.onKeyDown(event);
//         expect(modalServiceSpyObject.openDialog).not.toHaveBeenCalled();
//     });
// });

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServerService } from '@app/services/server.service';
import { NewFileId } from '@common/communication/new-file-id';
import { SavedFile } from '@common/communication/saved-file';
import { Subject, Subscription } from 'rxjs';

// const serverUrl = 'http://localhost:3000/api';
// const httpOptions = {
//     headers: new HttpHeaders({
//         'Content-Type': 'application/json',
//     }),
// };

fdescribe('ServerService', () => {
    let service: ServerService;
    let testSubscription: Subscription;
    let httpClientSpyObj: jasmine.SpyObj<HttpClient>;
    let snackBarSpyObj: jasmine.SpyObj<MatSnackBar>;
    let subscriberSpyOBj: jasmine.SpyObj<any>; // tslint:disable-line: no-any
    let consoleSpy: jasmine.Spy<any>; // tslint:disable-line: no-any
    const createDrawingSubject = new Subject<NewFileId>();
    const updateDrawingSubject = new Subject<void>();
    const getAllDrawingsSubject = new Subject<SavedFile[]>();
    const deleteDrawingSubject = new Subject<void>();
    const fileContent = 'TestContent';
    const newFileId = {id: '123'};
    const existingFileId = '456';

    beforeEach(() => {
        subscriberSpyOBj = jasmine.createSpyObj('Subscriber', [
            'successChannel',
            'errorChannel',
        ]);

        httpClientSpyObj = jasmine.createSpyObj('HttpClient', [
            'post',
            'put',
            'delete',
            'get',
        ]);
        httpClientSpyObj.post.and.returnValue(createDrawingSubject);
        httpClientSpyObj.put.and.returnValue(updateDrawingSubject);
        httpClientSpyObj.delete.and.returnValue(deleteDrawingSubject);
        httpClientSpyObj.get.and.returnValue(getAllDrawingsSubject);

        consoleSpy = spyOn(console, 'error');
        snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);
        TestBed.configureTestingModule({
        providers: [
            { provide: HttpClient, useValue: httpClientSpyObj},
            { provide: MatSnackBar, useValue: snackBarSpyObj },
        ],
        });
        service = TestBed.inject(ServerService);
    });

    afterEach(() => {
        testSubscription.unsubscribe();
    });

    // it('should be created', () => {
    //     expect(service).toBeTruthy();
    // });

    it('#createDrawing should make http post request and return the received file ID on success', () => {
        testSubscription = service.createDrawing(fileContent).subscribe((newId: NewFileId) => {
            subscriberSpyOBj.successChannel(newId);
        });
        createDrawingSubject.next(newFileId);
        // expect(httpClientSpyObj.post).toHaveBeenCalledWith(serverUrl + '/create', fileContent, httpOptions);
        expect(subscriberSpyOBj.successChannel).toHaveBeenCalled();
    });

    it('#createDrawing should return observable on error channel if post request returns and error', () => {
        const returnedError = new HttpErrorResponse({status: 404});
        testSubscription = service.createDrawing(fileContent).subscribe( (newId: NewFileId) => {
            subscriberSpyOBj.successChannel(newId);
        }, (error: HttpErrorResponse) => {
            subscriberSpyOBj.errorChannel(error);
        });
        createDrawingSubject.error(returnedError);
        expect(consoleSpy).toHaveBeenCalledWith('Failed request: create');
        expect(subscriberSpyOBj.errorChannel).toHaveBeenCalledWith(returnedError);
    });

    it('#updateDrawing should return no value when the request is successfull', () => {
        testSubscription = service.updateDrawing(existingFileId, fileContent).subscribe(() => {
            subscriberSpyOBj.successChannel();
        });
        updateDrawingSubject.next();
        expect(subscriberSpyOBj.successChannel).toHaveBeenCalled();
    });

    it('#updateDrawing should return observable on error channel if post request returns and error', () => {
        const returnedError = new HttpErrorResponse({status: 404});
        testSubscription = service.updateDrawing(existingFileId, fileContent).subscribe( () => {
            subscriberSpyOBj.successChannel();
        }, (error: HttpErrorResponse) => {
            subscriberSpyOBj.errorChannel(error);
        });
        updateDrawingSubject.error(returnedError);
        expect(consoleSpy).toHaveBeenCalledWith('Failed request: update/' + existingFileId);
        expect(subscriberSpyOBj.errorChannel).toHaveBeenCalledWith(returnedError);
    });

    it('#deleteDrawing should return no value when the request is successfull', () => {
        testSubscription = service.deleteDrawing(existingFileId).subscribe(() => {
            subscriberSpyOBj.successChannel();
        });
        deleteDrawingSubject.next();
        expect(subscriberSpyOBj.successChannel).toHaveBeenCalled();
    });

    it('#deleteDrawing should return observable on error channel if post request returns and error', () => {
        const returnedError = new HttpErrorResponse({status: 404});
        testSubscription = service.deleteDrawing(existingFileId).subscribe( () => {
            subscriberSpyOBj.successChannel();
        }, (error: HttpErrorResponse) => {
            subscriberSpyOBj.errorChannel(error);
        });
        deleteDrawingSubject.error(returnedError);
        expect(consoleSpy).toHaveBeenCalledWith('Failed request: delete/' + existingFileId);
        expect(subscriberSpyOBj.errorChannel).toHaveBeenCalledWith(returnedError);
    });

    it('#getAllDrawings should return array of SavedFiles when request is successfull', () => {
        const savedFile: SavedFile = {id: existingFileId, content: fileContent};
        const savedFileArray = [savedFile, savedFile, savedFile];

        testSubscription = service.getAllDrawings().subscribe((receivedSavedFiles: SavedFile[]) => {
            subscriberSpyOBj.successChannel(receivedSavedFiles);
        });
        getAllDrawingsSubject.next(savedFileArray);
        expect(subscriberSpyOBj.successChannel).toHaveBeenCalledWith(savedFileArray);
    });

    it('#getAllDrawings should return observable on error channel if post request returns and error', () => {
        const returnedError = new HttpErrorResponse({status: 404});
        testSubscription = service.getAllDrawings().subscribe( (receivedSavedFiles: SavedFile[]) => {
            subscriberSpyOBj.successChannel(receivedSavedFiles);
        }, (error: HttpErrorResponse) => {
            subscriberSpyOBj.errorChannel(error);
        });
        getAllDrawingsSubject.error(returnedError);
        expect(consoleSpy).toHaveBeenCalledWith('Failed request: get-all');
        expect(subscriberSpyOBj.errorChannel).toHaveBeenCalledWith(returnedError);
    });

});

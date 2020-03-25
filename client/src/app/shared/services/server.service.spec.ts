import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snackBarDuration } from '@app/shared/constants/snack-bar-duration';
import { ServerService } from '@app/shared/services/server.service';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import { NewFileId } from '@common/communication/new-file-id';
import { SavedFile } from '@common/communication/saved-file';
import { Subject } from 'rxjs';

// tslint:disable: max-file-line-count
fdescribe('ServerService', () => {
    let service: ServerService;
    let httpClientSpyObj: jasmine.SpyObj<HttpClient>;
    let snackBarSpyObj: jasmine.SpyObj<MatSnackBar>;
    let subscriberSpyOBj: jasmine.SpyObj<any>; // tslint:disable-line: no-any
    let consoleSpy: jasmine.Spy<any>; // tslint:disable-line: no-any
    let createDrawingSubject: Subject<NewFileId>;
    let updateDrawingSubject: Subject<void>;
    let getAllDrawingsSubject: Subject<SavedFile[]>;
    let deleteDrawingSubject: Subject<void>;
    const fileContent = 'TestContent';
    const newFileId = { id: '123' };
    const existingFileId = '456';

    beforeEach(async(() => {
        subscriberSpyOBj = jasmine.createSpyObj('Subscriber', ['successChannel', 'errorChannel']);

        httpClientSpyObj = jasmine.createSpyObj('HttpClient', ['post', 'put', 'delete', 'get']);
        createDrawingSubject = new Subject<NewFileId>();
        httpClientSpyObj.post.and.returnValue(createDrawingSubject);
        updateDrawingSubject = new Subject<void>();
        httpClientSpyObj.put.and.returnValue(updateDrawingSubject);
        deleteDrawingSubject = new Subject<void>();
        httpClientSpyObj.delete.and.returnValue(deleteDrawingSubject);
        getAllDrawingsSubject = new Subject<SavedFile[]>();
        httpClientSpyObj.get.and.returnValue(getAllDrawingsSubject);

        consoleSpy = spyOn(console, 'error');
        snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);
        TestBed.configureTestingModule({
            providers: [
                { provide: HttpClient, useValue: httpClientSpyObj },
                { provide: MatSnackBar, useValue: snackBarSpyObj },
            ],
        });
        service = TestBed.inject(ServerService);
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#createDrawing should make http post request and return the received file ID on success', async(() => {
        service.createDrawing(fileContent).subscribe((newId: NewFileId) => {
            subscriberSpyOBj.successChannel(newId);
        });
        createDrawingSubject.next(newFileId);
        expect(subscriberSpyOBj.successChannel).toHaveBeenCalled();
    }));

    it('#createDrawing should return observable on error channel if post request returns an error', async((done: DoneFn) => {
        const returnedError = new HttpErrorResponse({ status: 404 });
        service.createDrawing(fileContent).subscribe(
            (newId: NewFileId) => {
                subscriberSpyOBj.successChannel();
            },
            (error: HttpErrorResponse) => {
                subscriberSpyOBj.errorChannel(error);
            }
        );
        createDrawingSubject.error(returnedError);
        expect(consoleSpy).toHaveBeenCalledWith('Failed request: create');
        expect(subscriberSpyOBj.successChannel).not.toHaveBeenCalled();
        expect(subscriberSpyOBj.errorChannel).toHaveBeenCalledWith(returnedError);
    }));

    it('#updateDrawing should return no value when the request is successfull', async(() => {
        service.updateDrawing(existingFileId, fileContent).subscribe(() => {
            subscriberSpyOBj.successChannel();
        });
        updateDrawingSubject.next();
        expect(subscriberSpyOBj.successChannel).toHaveBeenCalled();
    }));

    it('#updateDrawing should return observable on error channel if post request returns an error', async(() => {
        const returnedError = new HttpErrorResponse({ status: 404 });
        service.updateDrawing(existingFileId, fileContent).subscribe(
            () => {
                subscriberSpyOBj.successChannel();
            },
            (error: HttpErrorResponse) => {
                subscriberSpyOBj.errorChannel(error);
            }
        );
        updateDrawingSubject.error(returnedError);
        expect(consoleSpy).toHaveBeenCalledWith('Failed request: update/' + existingFileId);
        expect(subscriberSpyOBj.successChannel).not.toHaveBeenCalled();
        expect(subscriberSpyOBj.errorChannel).toHaveBeenCalledWith(returnedError);
    }));

    it('#deleteDrawing should return no value when the request is successfull', async(() => {
        service.deleteDrawing(existingFileId).subscribe(() => {
            subscriberSpyOBj.successChannel();
        });
        deleteDrawingSubject.next();
        expect(subscriberSpyOBj.successChannel).toHaveBeenCalled();
    }));

    it('#deleteDrawing should return observable on error channel if post request returns an error', async(() => {
        const returnedError = new HttpErrorResponse({ status: 404 });
        service.deleteDrawing(existingFileId).subscribe(
            () => {
                subscriberSpyOBj.successChannel();
            },
            (error: HttpErrorResponse) => {
                subscriberSpyOBj.errorChannel(error);
            }
        );
        deleteDrawingSubject.error(returnedError);
        expect(consoleSpy).toHaveBeenCalledWith('Failed request: delete/' + existingFileId);
        expect(subscriberSpyOBj.successChannel).not.toHaveBeenCalled();
        expect(subscriberSpyOBj.errorChannel).toHaveBeenCalledWith(returnedError);
    }));

    it('#getAllDrawings should return array of SavedFiles when request is successfull', async(() => {
        const savedFile: SavedFile = { id: existingFileId, content: fileContent };
        const savedFileArray = [savedFile, savedFile, savedFile];
        service.getAllDrawings().subscribe((receivedSavedFiles: SavedFile[]) => {
            subscriberSpyOBj.successChannel(receivedSavedFiles);
        });
        getAllDrawingsSubject.next(savedFileArray);
        expect(subscriberSpyOBj.successChannel).toHaveBeenCalledWith(savedFileArray);
    }));

    it('#getAllDrawings should return observable on error channel if post request returns an error', async(() => {
        const returnedError = new HttpErrorResponse({ status: 404 });
        service.getAllDrawings().subscribe(
            (receivedSavedFiles: SavedFile[]) => {
                subscriberSpyOBj.successChannel();
            },
            (error: HttpErrorResponse) => {
                subscriberSpyOBj.errorChannel(error);
            }
        );
        getAllDrawingsSubject.error(returnedError);
        expect(consoleSpy).toHaveBeenCalledWith('Failed request: get-all');
        expect(subscriberSpyOBj.successChannel).not.toHaveBeenCalled();
        expect(subscriberSpyOBj.errorChannel).toHaveBeenCalledWith(returnedError);
    }));

    it('#alertRequestError should display appropriate message when the error is 0', async(() => {
        const returnedError = new HttpErrorResponse({ status: 0 });
        service.getAllDrawings().subscribe(
            (receivedSavedFiles: SavedFile[]) => {
                subscriberSpyOBj.successChannel();
            },
            (error: HttpErrorResponse) => {
                subscriberSpyOBj.errorChannel(error);
            }
        );
        getAllDrawingsSubject.error(returnedError);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Erreur : la communication avec le serveur a échoué.', undefined, {
            duration: snackBarDuration,
        });
    }));

    it('#alertRequestError should display appropriate message when the error code is HttpStatusCode.InternalServerError', async(() => {
        const returnedError = new HttpErrorResponse({ status: HttpStatusCode.InternalServerError });
        service.getAllDrawings().subscribe(
            (receivedSavedFiles: SavedFile[]) => {
                subscriberSpyOBj.successChannel();
            },
            (error: HttpErrorResponse) => {
                subscriberSpyOBj.errorChannel(error);
            }
        );
        getAllDrawingsSubject.error(returnedError);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Erreur : une erreur interne est survenue sur le serveur.', undefined, {
            duration: snackBarDuration,
        });
    }));

    it('#alertRequestError should display appropriate message when error is HttpStatusCode.NotImplemented', async(() => {
        const returnedError = new HttpErrorResponse({ status: HttpStatusCode.NotImplemented });
        service.getAllDrawings().subscribe(
            (receivedSavedFiles: SavedFile[]) => {
                subscriberSpyOBj.successChannel();
            },
            (error: HttpErrorResponse) => {
                subscriberSpyOBj.errorChannel(error);
            }
        );
        getAllDrawingsSubject.error(returnedError);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith("Erreur : cette requête n'est pas encore implémentée.", undefined, {
            duration: snackBarDuration,
        });
    }));

    it('#alertRequestError should display appropriate message when error is HttpStatusCode.BadGateway', async(() => {
        const returnedError = new HttpErrorResponse({ status: HttpStatusCode.BadGateway });
        service.getAllDrawings().subscribe(
            (receivedSavedFiles: SavedFile[]) => {
                subscriberSpyOBj.successChannel();
            },
            (error: HttpErrorResponse) => {
                subscriberSpyOBj.errorChannel(error);
            }
        );
        getAllDrawingsSubject.error(returnedError);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Erreur : la réponse reçue depuis le serveur est invalide.', undefined, {
            duration: snackBarDuration,
        });
    }));

    it('#alertRequestError should display appropriate message when error is HttpStatusCode.ServiceUnavailable', async(() => {
        const returnedError = new HttpErrorResponse({ status: HttpStatusCode.ServiceUnavailable });
        service.getAllDrawings().subscribe(
            (receivedSavedFiles: SavedFile[]) => {
                subscriberSpyOBj.successChannel();
            },
            (error: HttpErrorResponse) => {
                subscriberSpyOBj.errorChannel(error);
            }
        );
        getAllDrawingsSubject.error(returnedError);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Erreur : ce service est temporairement indisponible.', undefined, {
            duration: snackBarDuration,
        });
    }));

    it('#alertRequestError should display appropriate message when error is HttpStatusCode.GatewayTimeout', async(() => {
        const returnedError = new HttpErrorResponse({ status: HttpStatusCode.GatewayTimeout });
        service.getAllDrawings().subscribe(
            (receivedSavedFiles: SavedFile[]) => {
                subscriberSpyOBj.successChannel();
            },
            (error: HttpErrorResponse) => {
                subscriberSpyOBj.errorChannel(error);
            }
        );
        getAllDrawingsSubject.error(returnedError);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith("Erreur : le temps d'attente de la réponse du serveur est écoulé.", undefined, {
            duration: snackBarDuration,
        });
    }));

    it('#alertRequestError should display appropriate message when error is HttpStatusCode.HttpVersionNotSupported', async(() => {
        const returnedError = new HttpErrorResponse({ status: HttpStatusCode.HttpVersionNotSupported });
        service.getAllDrawings().subscribe(
            (receivedSavedFiles: SavedFile[]) => {
                subscriberSpyOBj.successChannel();
            },
            (error: HttpErrorResponse) => {
                subscriberSpyOBj.errorChannel(error);
            }
        );
        getAllDrawingsSubject.error(returnedError);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith("Erreur : cette version HTTP n'est pas supportée.", undefined, {
            duration: snackBarDuration,
        });
    }));

    it('#alertRequestError should display appropriate message when error is HttpStatusCode.VariantAlsoNegotiates', async(() => {
        const returnedError = new HttpErrorResponse({ status: HttpStatusCode.VariantAlsoNegotiates });
        service.getAllDrawings().subscribe(
            (receivedSavedFiles: SavedFile[]) => {
                subscriberSpyOBj.successChannel();
            },
            (error: HttpErrorResponse) => {
                subscriberSpyOBj.errorChannel(error);
            }
        );
        getAllDrawingsSubject.error(returnedError);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Erreur : problème de négociation.', undefined, {
            duration: snackBarDuration,
        });
    }));

    it('#alertRequestError should display appropriate message when error is HttpStatusCode.InsufficientStorage', async(() => {
        const returnedError = new HttpErrorResponse({ status: HttpStatusCode.InsufficientStorage });
        service.getAllDrawings().subscribe(
            (receivedSavedFiles: SavedFile[]) => {
                subscriberSpyOBj.successChannel();
            },
            (error: HttpErrorResponse) => {
                subscriberSpyOBj.errorChannel(error);
            }
        );
        getAllDrawingsSubject.error(returnedError);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith("Erreur : l'espace pour effectuer cette requête est insuffisant.", undefined, {
            duration: snackBarDuration,
        });
    }));

    it('#alertRequestError should display appropriate message when error is HttpStatusCode.LoopDetected', async(() => {
        const returnedError = new HttpErrorResponse({ status: HttpStatusCode.LoopDetected });
        service.getAllDrawings().subscribe(
            (receivedSavedFiles: SavedFile[]) => {
                subscriberSpyOBj.successChannel();
            },
            (error: HttpErrorResponse) => {
                subscriberSpyOBj.errorChannel(error);
            }
        );
        getAllDrawingsSubject.error(returnedError);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Erreur : une boucle infinie a été détectée lors de la requête.', undefined, {
            duration: snackBarDuration,
        });
    }));

    it('#alertRequestError should display appropriate message when error is HttpStatusCode.NotExtended', async(() => {
        const returnedError = new HttpErrorResponse({ status: HttpStatusCode.NotExtended });
        service.getAllDrawings().subscribe(
            (receivedSavedFiles: SavedFile[]) => {
                subscriberSpyOBj.successChannel();
            },
            (error: HttpErrorResponse) => {
                subscriberSpyOBj.errorChannel(error);
            }
        );
        getAllDrawingsSubject.error(returnedError);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith(
            'Erreur : des extensions sont nécessaires pour satisfaire la requête.',
            undefined,
            { duration: snackBarDuration }
        );
    }));

    it('#alertRequestError should display appropriate message when error is HttpStatusCode.NetworkAuthenticationRequired', async(() => {
        const returnedError = new HttpErrorResponse({ status: HttpStatusCode.NetworkAuthenticationRequired });
        service.getAllDrawings().subscribe(
            (receivedSavedFiles: SavedFile[]) => {
                subscriberSpyOBj.successChannel();
            },
            (error: HttpErrorResponse) => {
                subscriberSpyOBj.errorChannel(error);
            }
        );
        getAllDrawingsSubject.error(returnedError);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Erreur : une authentification est nécessaire.', undefined, {
            duration: snackBarDuration,
        });
    }));

    it('#alertRequestError should display appropriate message when error is unknown', async(() => {
        const returnedError = new HttpErrorResponse({ status: -1 });
        service.getAllDrawings().subscribe(
            (receivedSavedFiles: SavedFile[]) => {
                subscriberSpyOBj.successChannel();
            },
            (error: HttpErrorResponse) => {
                subscriberSpyOBj.errorChannel(error);
            }
        );
        getAllDrawingsSubject.error(returnedError);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Erreur : erreur inconnue', undefined, {
            duration: snackBarDuration,
        });
    }));
});

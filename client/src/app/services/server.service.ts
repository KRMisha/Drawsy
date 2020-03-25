import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snackBarDuration } from '@app/modals/constants/snack-bar-duration';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import { NewFileContent } from '@common/communication/new-file-content';
import { NewFileId } from '@common/communication/new-file-id';
import { SavedFile } from '@common/communication/saved-file';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const serverUrl = 'http://localhost:3000/api';
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class ServerService {
    constructor(private httpService: HttpClient, private snackBar: MatSnackBar) {}

    createDrawing(fileContent: string): Observable<NewFileId> {
        const newFileContent: NewFileContent = { content: fileContent };
        return this.httpService
            .post<NewFileId>(serverUrl + '/create', newFileContent, httpOptions)
            .pipe(catchError(this.alertRequestError('create')));
    }

    updateDrawing(fileId: string, fileContent: string): Observable<void> {
        const newFileContent: NewFileContent = { content: fileContent };
        return this.httpService
            .put<void>(serverUrl + '/update/' + fileId, newFileContent, httpOptions)
            .pipe(catchError(this.alertRequestError('update/' + fileId)));
    }

    deleteDrawing(fileId: string): Observable<void> {
        return this.httpService.delete<void>(serverUrl + '/delete/' + fileId).pipe(catchError(this.alertRequestError('delete/' + fileId)));
    }

    getAllDrawings(): Observable<SavedFile[]> {
        return this.httpService.get<SavedFile[]>(serverUrl + '/get-all').pipe(catchError(this.alertRequestError('get-all')));
    }

    private alertRequestError(request: string): (error: HttpErrorResponse) => Observable<never> {
        return (error: HttpErrorResponse): Observable<never> => {
            let errorMessage: string;
            switch (error.status) {
                case 0:
                    errorMessage = 'Erreur : la communication avec le serveur a échoué.';
                    break;
                case HttpStatusCode.InternalServerError:
                    errorMessage = 'Erreur : une erreur interne est survenue sur le serveur.';
                    break;
                case HttpStatusCode.NotImplemented:
                    errorMessage = "Erreur : cette requête n'est pas encore implémentée.";
                    break;
                case HttpStatusCode.BadGateway:
                    errorMessage = 'Erreur : la réponse reçue depuis le serveur est invalide.';
                    break;
                case HttpStatusCode.ServiceUnavailable:
                    errorMessage = 'Erreur : ce service est temporairement indisponible.';
                    break;
                case HttpStatusCode.GatewayTimeout:
                    errorMessage = "Erreur : le temps d'attente de la réponse du serveur est écoulé.";
                    break;
                case HttpStatusCode.HttpVersionNotSupported:
                    errorMessage = "Erreur : cette version HTTP n'est pas supportée.";
                    break;
                case HttpStatusCode.VariantAlsoNegotiates:
                    errorMessage = 'Erreur : problème de négociation.';
                    break;
                case HttpStatusCode.InsufficientStorage:
                    errorMessage = "Erreur : l'espace pour effectuer cette requête est insuffisant.";
                    break;
                case HttpStatusCode.LoopDetected:
                    errorMessage = 'Erreur : une boucle infinie a été détectée lors de la requête.';
                    break;
                case HttpStatusCode.NotExtended:
                    errorMessage = 'Erreur : des extensions sont nécessaires pour satisfaire la requête.';
                    break;
                case HttpStatusCode.NetworkAuthenticationRequired:
                    errorMessage = 'Erreur : une authentification est nécessaire.';
                    break;
                default:
                    errorMessage = 'Erreur : erreur inconnue';
                    break;
            }

            this.snackBar.open(errorMessage, undefined, {
                duration: snackBarDuration,
            });

            console.error('Failed request: ' + request);

            return throwError(error);
        };
    }
}

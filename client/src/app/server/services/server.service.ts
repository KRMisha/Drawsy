import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpStatusCode } from '../../../../../common/communication/http-status-code.enum';
import { NewFileContent } from '../../../../../common/communication/new-file-content';
import { NewFileId } from '../../../../../common/communication/new-file-id';
import { SavedFile } from '../../../../../common/communication/saved-file';

const serverUrl = 'http://localhost:3000/api';
const options = {
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
            .post<NewFileId>(serverUrl + '/create', JSON.stringify(newFileContent), options)
            .pipe(catchError(this.handleError('create')));
    }

    updateDrawing(fileId: string, fileContent: string): Observable<void> {
        const newFileContent: NewFileContent = { content: fileContent };
        return this.httpService
            .put<void>(serverUrl + '/update/' + fileId, JSON.stringify(newFileContent), options)
            .pipe(catchError(this.handleError('updateDrawing' + fileId)));
    }

    getAllDrawings(): Observable<SavedFile[]> {
        return this.httpService.get<SavedFile[]>(serverUrl + '/get_all').pipe(catchError(this.handleError('getAllDrawings')));
    }

    deleteDrawing(fileId: string): Observable<void> {
        return this.httpService
            .delete<void>(serverUrl + '/delete/pipi' + fileId)
            .pipe(catchError(this.handleError('deleteDrawing' + fileId)));
    }

    private handleError(request: string): (error: Error) => Observable<never> {
        return (error: HttpErrorResponse): Observable<never> => {
            let errorMessage = '';
            switch (error.status) {
                case 0:
                    errorMessage = 'Erreur: La communication avec le serveur a échouée.';
                    break;
                case HttpStatusCode.InternalServerError:
                    errorMessage = 'Erreur: Un problème interne est survenu.';
                    break;
                case HttpStatusCode.NotImplemented:
                    errorMessage = "Erreur: Cette requête n'est pas encore implémentée.";
                    break;
                case HttpStatusCode.BadGateway:
                    errorMessage = 'Erreur: La réponse reçue depuis le serveur est invalide.';
                    break;
                case HttpStatusCode.ServiceUnavailable:
                    errorMessage = 'Erreur: Ce service est temporairement indisponible.';
                    break;
                case HttpStatusCode.GatewayTimeout:
                    errorMessage = "Erreur: Le temps d'attente de la réponse du serveur est écoulé.";
                    break;
                case HttpStatusCode.HttpVersionNotSupported:
                    errorMessage = "Erreur: Cette version HTTP n'est pas supportée.";
                    break;
                case HttpStatusCode.VariantAlsoNegotiates:
                    errorMessage = 'Erreur: Problème de négociation.';
                    break;
                case HttpStatusCode.InsufficientStorage:
                    errorMessage = "Erreur: L'espace pour effectuer cette requête est insuffisant.";
                    break;
                case HttpStatusCode.LoopDetected:
                    errorMessage = 'Erreur: Une boucle infinie a été détectée lors de la requête.';
                    break;
                case HttpStatusCode.NotExtended:
                    errorMessage = 'Erreur: Des extensions sont nécessaires pour satisfaire la requête.';
                    break;
                case HttpStatusCode.NetworkAuthenticationRequired:
                    errorMessage = 'Erreur: Une authentification est nécessaire.';
                    break;
                default:
                    errorMessage = 'Une erreur est survenue.';
            }

            this.snackBar.open(errorMessage, undefined, {
                duration: 4000,
            });
            console.error('Failed Request: ' + request);

            return throwError(error);
        };
    }
}

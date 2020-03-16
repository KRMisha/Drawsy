import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    constructor(private httpService: HttpClient) {}

    createDrawing(fileContent: string): Observable<NewFileId> {
        const newFileContent: NewFileContent = { content: fileContent };
        return this.httpService
            .post<NewFileId>(serverUrl + '/create', JSON.stringify(newFileContent), options)
            .pipe(catchError(this.handleError<NewFileId>('create')));
    }

    updateDrawing(fileId: string, fileContent: string): Observable<void> {
        const newFileContent: NewFileContent = { content: fileContent };
        return this.httpService
            .put<void>(serverUrl + '/update/' + fileId, JSON.stringify(newFileContent), options)
            .pipe(catchError(this.handleError<void>('updateDrawing' + fileId)));
    }

    getAllDrawings(): Observable<SavedFile[]> {
        return this.httpService.get<SavedFile[]>(serverUrl + '/get_all').pipe(catchError(this.handleError<SavedFile[]>('getAllDrawings')));
    }

    deleteDrawing(fileId: string): Observable<void> {
        return this.httpService
            .delete<void>(serverUrl + '/delete/' + fileId)
            .pipe(catchError(this.handleError<void>('deleteDrawing' + fileId)));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}

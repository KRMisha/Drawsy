import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SvgFileContainer } from '@app/classes/svg-file-container';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NewFileContent } from '../../../../../common/communication/new-file-content';
import { NewFileId } from '../../../../../common/communication/new-file-id';
import { SavedFile } from '../../../../../common/communication/saved-file';

const serverUrl = 'http://localhost:3000/api';
const httpOption = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class ServerService {
    constructor(private httpService: HttpClient) {}

    createDrawing(svgFileContainer: SvgFileContainer): Observable<NewFileId> {
        const newFile: NewFileContent = { content: svgFileContainer.drawingRoot.outerHTML };
        console.log(JSON.stringify(newFile));
        console.log(serverUrl + '/create');
        return this.httpService
            .post<NewFileId>(serverUrl + '/create', JSON.stringify(newFile), httpOption)
            .pipe(catchError(this.handleError<NewFileId>('create')));
    }

    updateDrawing(svgFileContainer: SvgFileContainer): Observable<SavedFile> {
        const savedFile: SavedFile = { id: svgFileContainer.id, content: svgFileContainer.drawingRoot.outerHTML };
        return this.httpService
            .put<SavedFile>(serverUrl + '/update/' + savedFile.id, JSON.stringify(savedFile), httpOption)
            .pipe(catchError(this.handleError<SavedFile>('updateDrawing' + svgFileContainer.id)));
    }

    getAllDrawings(): Observable<SavedFile[]> {
        return this.httpService.get<SavedFile[]>(serverUrl + '/get_all').pipe(catchError(this.handleError<SavedFile[]>('getAllDrawings')));
    }

    deleteDrawing(svgFileContainer: SvgFileContainer): Observable<SavedFile> {
        return this.httpService
            .delete<SavedFile>(serverUrl + '/delete/' + svgFileContainer.id)
            .pipe(catchError(this.handleError<SavedFile>('deleteDrawing' + svgFileContainer.id)));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}

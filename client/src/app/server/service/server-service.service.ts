import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SvgFileContainer } from '@app/classes/svg-file-container';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NewFile } from '../../../../../common/communication/new-file';
import { SavedFile } from '../../../../../common/communication/saved-file';

const serverUrl = 'http://localhost:3000/api';
const httpOption = {headers: new HttpHeaders({
    'Content-Type':  'application/json',
})}

@Injectable({
    providedIn: 'root',
})
export class ServerService {
    constructor(private httpService: HttpClient) {}

    createDrawing(svgFileContainer: SvgFileContainer): Observable<NewFile> {
        const newFile: NewFile = {content: svgFileContainer.drawingRoot.outerHTML};
        return this.httpService
            .post<NewFile>(serverUrl + '/create', JSON.stringify(newFile), httpOption)
            .pipe(catchError(this.handdleError<NewFile>('create')));
    }

    updateDrawing(svgFileContainer: SvgFileContainer): Observable<SavedFile> {
        const savedFile: SavedFile = {id: svgFileContainer.id, content: svgFileContainer.drawingRoot.outerHTML};
        return this.httpService
            .put<SavedFile>(serverUrl + '/update/' + savedFile.id, JSON.stringify(savedFile), httpOption)
            .pipe(catchError(this.handdleError<SavedFile>('updateDrawing' + svgFileContainer.id)));
    }

    getAllDrawings(): Observable<SavedFile[]> {
        return this.httpService.get<SavedFile[]>(serverUrl + '/get_all')
            .pipe(catchError(this.handdleError<SavedFile[]>('getAllDrawings')));
    }

    deleteDrawing(svgFileContainer: SvgFileContainer): Observable<SavedFile> {
        return this.httpService
            .delete<SavedFile>(serverUrl + '/delete/' + svgFileContainer.id)
            .pipe(catchError(this.handdleError<SavedFile>('deleteDrawing' + svgFileContainer.id)));
    }

    // WTF IS THIS!!!!!!!!!!!!!!!!
    private handdleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}

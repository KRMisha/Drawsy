import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SvgFileContainer } from '@app/classes/svg-file-container';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../../../../../common/communication/message';

const serverUrl = 'localhost:3000/api';

@Injectable({
    providedIn: 'root',
})
export class ServerService {
    constructor(private httpService: HttpClient) {}

    createDrawing(svgFileContainer: SvgFileContainer): Observable<Message> {
        return this.httpService
            .post<Message>(serverUrl + '/create', svgFileContainer.drawingRoot.outerHTML)
            .pipe(catchError(this.handdleError<Message>('create')));
    }

    updateDrawing(svgFileContainer: SvgFileContainer): Observable<Message> {
        return this.httpService
            .put<Message>(serverUrl + '/update/' + svgFileContainer.id, svgFileContainer.drawingRoot.outerHTML)
            .pipe(catchError(this.handdleError<Message>('updateDrawing' + svgFileContainer.id)));
    }

    getAllDrawings(): Observable<Message[]> {
        return this.httpService.get<Message[]>(serverUrl + '/getAll').pipe(catchError(this.handdleError<Message[]>('getAllDrawings')));
    }

    deleteDrawing(svgFileContainer: SvgFileContainer): Observable<Message> {
        return this.httpService
            .delete<Message>(serverUrl + '/delete/' + svgFileContainer.id)
            .pipe(catchError(this.handdleError<Message>('deleteDrawing' + svgFileContainer.id)));
    }

    // WTF IS THIS!!!!!!!!!!!!!!!!
    private handdleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}

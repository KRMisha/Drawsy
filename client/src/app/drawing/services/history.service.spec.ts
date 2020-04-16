import { TestBed } from '@angular/core/testing';
import { Command } from '@app/drawing/classes/commands/command';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Subject } from 'rxjs';

// tslint:disable: no-string-literal

describe('HistoryService', () => {
    let service: HistoryService;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let commandSpyObj: jasmine.SpyObj<Command>;
    let undoStackPopSpy: jasmine.Spy;
    let redoStackPopSpy: jasmine.Spy;
    let undoStackPushSpy: jasmine.Spy;
    let redoStackPushSpy: jasmine.Spy;
    let drawingHistoryChangedNextSpy: jasmine.Spy;

    let drawingLoadedSubject: Subject<void>;

    beforeEach(() => {
        drawingLoadedSubject = new Subject<void>();
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['saveDrawingToStorage'], {
            drawingLoaded$: drawingLoadedSubject,
        });

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpyObj }],
        });
        service = TestBed.inject(HistoryService);
        commandSpyObj = jasmine.createSpyObj('Command', ['undo', 'redo']);
        undoStackPopSpy = spyOn(service['undoStack'], 'pop').and.callThrough();
        redoStackPopSpy = spyOn(service['redoStack'], 'pop').and.callThrough();
        undoStackPushSpy = spyOn(service['undoStack'], 'push');
        redoStackPushSpy = spyOn(service['redoStack'], 'push');
        drawingHistoryChangedNextSpy = spyOn<any>(service['drawingHistoryChangedSource'], 'next'); // tslint:disable-line: no-any
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#ngOnDestroy should unsubscribe from the drawingLoaded subscription', () => {
        const unsubscribeSpy = spyOn(service['drawingLoadedSubscription'], 'unsubscribe');
        service.ngOnDestroy();
        expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('#undo should do nothing if undoStack is empty', () => {
        service['undoStack'] = [];
        service.undo();

        expect(undoStackPopSpy).not.toHaveBeenCalled();
        expect(redoStackPopSpy).not.toHaveBeenCalled();
        expect(undoStackPushSpy).not.toHaveBeenCalled();
        expect(redoStackPushSpy).not.toHaveBeenCalled();
    });

    it('#undo should undo the last command and put it in redoStack if undoStack is not empty', () => {
        service['undoStack'] = [commandSpyObj];
        service.undo();
        expect(commandSpyObj.undo).toHaveBeenCalled();
        expect(redoStackPushSpy).toHaveBeenCalled();
        expect(drawingHistoryChangedNextSpy).toHaveBeenCalled();
        expect(drawingServiceSpyObj.saveDrawingToStorage).toHaveBeenCalled();
    });

    it('#redo should do nothing if redoStack is empty', () => {
        service.redo();
        expect(undoStackPushSpy).not.toHaveBeenCalled();
        expect(commandSpyObj.undo).not.toHaveBeenCalled();
        expect(drawingHistoryChangedNextSpy).not.toHaveBeenCalled();
        expect(drawingServiceSpyObj.saveDrawingToStorage).not.toHaveBeenCalled();
    });

    it('#redo should redo the last command and put it in undoStack if redoStack is not empty', () => {
        service['redoStack'] = [commandSpyObj];
        service.redo();
        expect(commandSpyObj.redo).toHaveBeenCalled();
        expect(undoStackPushSpy).toHaveBeenCalledWith(commandSpyObj);
        expect(drawingHistoryChangedNextSpy).toHaveBeenCalled();
        expect(drawingServiceSpyObj.saveDrawingToStorage).toHaveBeenCalled();
    });

    it('#addCommand should add a command to undoStack and empty redoStack', () => {
        service['redoStack'] = [commandSpyObj];

        service.addCommand(commandSpyObj);

        expect(undoStackPushSpy).toHaveBeenCalledWith(commandSpyObj);
        expect(service['redoStack'].length).toEqual(0);
        expect(drawingHistoryChangedNextSpy).toHaveBeenCalled();
        expect(drawingServiceSpyObj.saveDrawingToStorage).toHaveBeenCalled();
    });

    it('#canUndo should return true if undoStack is not empty', () => {
        service['undoStack'] = [commandSpyObj];
        const returnedValue = service.canUndo();
        expect(returnedValue).toEqual(true);
    });

    it('#canUndo should return false if undoStack is empty', () => {
        const returnedValue = service.canUndo();
        expect(returnedValue).toEqual(false);
    });

    it('#canRedo should return true if redoStack is not empty', () => {
        service['redoStack'] = [commandSpyObj];
        const returnedValue = service.canRedo();
        expect(returnedValue).toEqual(true);
    });

    it('#canRedo should return false if redoStack is empty', () => {
        const returnedValue = service.canRedo();
        expect(returnedValue).toEqual(false);
    });

    it('#onDrawingLoad should empty undoStack and redoStack', () => {
        service['undoStack'] = [commandSpyObj];
        service['redoStack'] = [commandSpyObj];

        service['onDrawingLoad']();

        expect(service['undoStack'].length).toEqual(0);
        expect(service['redoStack'].length).toEqual(0);
    });
});

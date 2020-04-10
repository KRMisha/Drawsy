import { TestBed } from '@angular/core/testing';
import { Command } from '@app/drawing/classes/commands/command';
import { HistoryService } from '@app/drawing/services/history.service';

// tslint:disable: no-string-literal

describe('HistoryService', () => {
    let service: HistoryService;
    let commandSpyObj: jasmine.SpyObj<Command>;
    let undoStackPopSpy: jasmine.Spy;
    let redoStackPopSpy: jasmine.Spy;
    let undoStackPushSpy: jasmine.Spy;
    let redoStackPushSpy: jasmine.Spy;

    beforeEach(() => {
        service = TestBed.inject(HistoryService);
        commandSpyObj = jasmine.createSpyObj('Command', ['undo', 'redo']);
        undoStackPopSpy = spyOn(service['undoStack'], 'pop').and.callThrough();
        redoStackPopSpy = spyOn(service['redoStack'], 'pop').and.callThrough();
        undoStackPushSpy = spyOn(service['undoStack'], 'push');
        redoStackPushSpy = spyOn(service['redoStack'], 'push');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
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
    });

    it('#redo should do nothing if redoStack is empty', () => {
        service.redo();
        expect(undoStackPushSpy).not.toHaveBeenCalled();
        expect(commandSpyObj.undo).not.toHaveBeenCalled();
    });

    it('#redo should redo the last command and put it in undoStack if redoStack is not empty', () => {
        service['redoStack'] = [commandSpyObj];
        service.redo();
        expect(commandSpyObj.redo).toHaveBeenCalled();
        expect(undoStackPushSpy).toHaveBeenCalledWith(commandSpyObj);
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

    it('#addCommand should add a command to undoStack and empty redoStack', () => {
        service['redoStack'] = [commandSpyObj];

        service.addCommand(commandSpyObj);

        expect(undoStackPushSpy).toHaveBeenCalledWith(commandSpyObj);
        expect(service['redoStack'].length).toEqual(0);
    });

    it('#clearCommands should empty undoStack and redoStack', () => {
        service['undoStack'] = [commandSpyObj];
        service['redoStack'] = [commandSpyObj];

        service.clearCommands();

        expect(service['undoStack'].length).toEqual(0);
        expect(service['redoStack'].length).toEqual(0);
    });
});

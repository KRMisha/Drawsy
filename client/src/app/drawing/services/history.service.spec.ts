import { TestBed } from '@angular/core/testing';
import { Command } from '@app/drawing/classes/commands/command';
import { HistoryService } from '@app/drawing/services/history.service';

// tslint:disable: no-string-literal

describe('HistoryService', () => {
    let service: HistoryService;
    let commandSpyObj: jasmine.SpyObj<Command>;
    let undoCommandsPopSpy: jasmine.Spy;
    let redoCommandsPopSpy: jasmine.Spy;
    let undoCommandsPushSpy: jasmine.Spy;
    let redoCommandsPushSpy: jasmine.Spy;

    beforeEach(() => {
        service = TestBed.inject(HistoryService);
        commandSpyObj = jasmine.createSpyObj('Command', ['undo', 'redo']);
        undoCommandsPopSpy = spyOn(service['undoCommands'], 'pop').and.callThrough();
        redoCommandsPopSpy = spyOn(service['redoCommands'], 'pop').and.callThrough();
        undoCommandsPushSpy = spyOn(service['undoCommands'], 'push');
        redoCommandsPushSpy = spyOn(service['redoCommands'], 'push');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#undo should do nothing if undoCommands is empty', () => {
        service['undoCommands'] = [];
        service.undo();

        expect(undoCommandsPopSpy).not.toHaveBeenCalled();
        expect(redoCommandsPopSpy).not.toHaveBeenCalled();
        expect(undoCommandsPushSpy).not.toHaveBeenCalled();
        expect(redoCommandsPushSpy).not.toHaveBeenCalled();
    });

    it('#undo should undo the last command and put it in redoCommands if undoCommands is not empty', () => {
        service['undoCommands'] = [commandSpyObj];
        service.undo();
        expect(commandSpyObj.undo).toHaveBeenCalled();
        expect(redoCommandsPushSpy).toHaveBeenCalled();
    });

    it('#redo should do nothing if redoCommands is empty', () => {
        service.redo();
        expect(undoCommandsPushSpy).not.toHaveBeenCalled();
        expect(commandSpyObj.undo).not.toHaveBeenCalled();
    });

    it('#redo should redo the last command and put it in undoCommands if redoCommands is not empty', () => {
        service['redoCommands'] = [commandSpyObj];
        service.redo();
        expect(commandSpyObj.redo).toHaveBeenCalled();
        expect(undoCommandsPushSpy).toHaveBeenCalledWith(commandSpyObj);
    });

    it('#hasUndoCommands should return true if it is not empty', () => {
        service['undoCommands'] = [commandSpyObj];
        const returnedValue = service.hasUndoCommands();
        expect(returnedValue).toEqual(true);
    });

    it('#hasUndoCommands should return false if it is empty', () => {
        const returnedValue = service.hasUndoCommands();
        expect(returnedValue).toEqual(false);
    });

    it('#hasRedoCommands should return true if it is not empty', () => {
        service['redoCommands'] = [commandSpyObj];
        const returnedValue = service.hasRedoCommands();
        expect(returnedValue).toEqual(true);
    });

    it('#hasRedoCommands should return false if it is empty', () => {
        const returnedValue = service.hasRedoCommands();
        expect(returnedValue).toEqual(false);
    });

    it('#addCommand should add a command to undoCommands and empty redoCommands', () => {
        service['redoCommands'] = [commandSpyObj];

        service.addCommand(commandSpyObj);

        expect(undoCommandsPushSpy).toHaveBeenCalledWith(commandSpyObj);
        expect(service['redoCommands'].length).toEqual(0);
    });

    it('#clearCommands should empty undoCommands and redoCommands', () => {
        service['undoCommands'] = [commandSpyObj];
        service['redoCommands'] = [commandSpyObj];

        service.clearCommands();

        expect(service['undoCommands'].length).toEqual(0);
        expect(service['redoCommands'].length).toEqual(0);
    });
});

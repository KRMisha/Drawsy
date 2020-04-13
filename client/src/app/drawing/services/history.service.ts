import { Injectable } from '@angular/core';
import { Command } from '@app/drawing/classes/commands/command';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HistoryService {
    private undoStack: Command[] = [];
    private redoStack: Command[] = [];

    private drawingHistoryChangedSource = new Subject<void>();

    // Disable member ordering lint error for public observables initialized after private subjects
    drawingHistoryChanged$ = this.drawingHistoryChangedSource.asObservable(); // tslint:disable-line: member-ordering

    undo(): void {
        const command = this.undoStack.pop();
        if (command !== undefined) {
            command.undo();
            this.redoStack.push(command);
        }
        this.drawingHistoryChangedSource.next();
    }

    redo(): void {
        const command = this.redoStack.pop();
        if (command !== undefined) {
            command.redo();
            this.undoStack.push(command);
        }
        this.drawingHistoryChangedSource.next();
    }

    addCommand(command: Command): void {
        this.undoStack.push(command);
        this.redoStack = [];
        this.drawingHistoryChangedSource.next();
    }

    onDrawingLoad(): void {
        this.undoStack = [];
        this.redoStack = [];
    }

    canUndo(): boolean {
        return this.undoStack.length > 0;
    }

    canRedo(): boolean {
        return this.redoStack.length > 0;
    }
}

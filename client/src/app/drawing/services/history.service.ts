import { Injectable } from '@angular/core';
import { Command } from '@app/drawing/classes/commands/command';

@Injectable({
    providedIn: 'root',
})
export class HistoryService {
    private undoStack: Command[] = [];
    private redoStack: Command[] = [];

    undo(): void {
        const command = this.undoStack.pop();
        if (command !== undefined) {
            command.undo();
            this.redoStack.push(command);
        }
    }

    redo(): void {
        const command = this.redoStack.pop();
        if (command !== undefined) {
            command.redo();
            this.undoStack.push(command);
        }
    }

    addCommand(command: Command): void {
        this.undoStack.push(command);
        this.redoStack = [];
    }

    clearCommands(): void {
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

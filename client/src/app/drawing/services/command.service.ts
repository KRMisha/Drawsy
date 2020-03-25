import { Injectable } from '@angular/core';
import { Command } from '@app/shared/classes/commands/command';

@Injectable({
    providedIn: 'root',
})
export class CommandService {
    private undoCommands: Command[] = [];
    private redoCommands: Command[] = [];

    undo(): void {
        if (this.undoCommands.length > 0) {
            const command = this.undoCommands.pop() as Command;
            command.undo();
            this.redoCommands.push(command);
        }
    }

    redo(): void {
        if (this.redoCommands.length > 0) {
            const command = this.redoCommands.pop() as Command;
            command.redo();
            this.undoCommands.push(command);
        }
    }

    hasUndoCommands(): boolean {
        return this.undoCommands.length > 0;
    }

    hasRedoCommands(): boolean {
        return this.redoCommands.length > 0;
    }

    addCommand(command: Command): void {
        this.undoCommands.push(command);
        this.redoCommands = [];
    }

    clearCommands(): void {
        this.undoCommands = [];
        this.redoCommands = [];
    }
}

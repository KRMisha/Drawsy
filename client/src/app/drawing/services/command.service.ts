import { Injectable } from '@angular/core';
import { Command } from '@app/drawing/classes/commands/command';

@Injectable({
    providedIn: 'root',
})
export class CommandService {
    private undoCommands: Command[] = [];
    private redoCommands: Command[] = [];

    undo(): void {
        const command = this.undoCommands.pop();
        if (command !== undefined) {
            command.undo();
            this.redoCommands.push(command);
        }
    }

    redo(): void {
        const command = this.redoCommands.pop();
        if (command !== undefined) {
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

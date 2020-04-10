import { Injectable, OnDestroy } from '@angular/core';
import { Command } from '@app/drawing/classes/commands/command';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HistoryService implements OnDestroy {
    private undoStack: Command[] = [];
    private redoStack: Command[] = [];

    private drawingLoadedSubscription: Subscription;

    constructor(private drawingService: DrawingService) {
        this.drawingLoadedSubscription = this.drawingService.drawingLoaded$.subscribe(this.clearCommands.bind(this));
    }

    ngOnDestroy(): void {
        this.drawingLoadedSubscription.unsubscribe();
    }

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

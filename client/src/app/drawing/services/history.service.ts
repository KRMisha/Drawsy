import { Injectable, OnDestroy } from '@angular/core';
import { Command } from '@app/drawing/classes/commands/command';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Subject, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HistoryService implements OnDestroy {
    private undoStack: Command[] = [];
    private redoStack: Command[] = [];

    private drawingLoadedSubscription: Subscription;

    private drawingHistoryChangedSource = new Subject<void>();

    // Disable member ordering lint error for public observables initialized after private subjects
    drawingHistoryChanged$ = this.drawingHistoryChangedSource.asObservable(); // tslint:disable-line: member-ordering

    constructor(private drawingService: DrawingService) {
        this.drawingLoadedSubscription = this.drawingService.drawingLoaded$.subscribe(this.onDrawingLoad.bind(this));
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

        this.drawingHistoryChangedSource.next();
        this.drawingService.saveDrawingToStorage();
    }

    redo(): void {
        const command = this.redoStack.pop();
        if (command !== undefined) {
            command.redo();
            this.undoStack.push(command);
        }

        this.drawingHistoryChangedSource.next();
        this.drawingService.saveDrawingToStorage();
    }

    addCommand(command: Command): void {
        this.undoStack.push(command);
        this.redoStack = [];

        this.drawingHistoryChangedSource.next();
        this.drawingService.saveDrawingToStorage();
    }

    canUndo(): boolean {
        return this.undoStack.length > 0;
    }

    canRedo(): boolean {
        return this.redoStack.length > 0;
    }

    private onDrawingLoad(): void {
        this.undoStack = [];
        this.redoStack = [];
    }
}

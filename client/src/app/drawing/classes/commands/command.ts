export abstract class Command {
    abstract undo(): void;
    abstract redo(): void;
}

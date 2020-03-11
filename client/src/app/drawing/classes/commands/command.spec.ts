import { Command } from './command';

class CommandMock extends Command {
    undo(): void {
        return;
    }
    redo(): void {
        return;
    }
}

describe('Command', () => {
    let mockCommand: CommandMock;
    beforeEach(() => {
        mockCommand = new CommandMock();
    });

    it('derived classes of Command should be an instance of Command', () => {
        expect(mockCommand instanceof Command).toBe(true);
    });
});

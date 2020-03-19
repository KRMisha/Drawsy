import { TestBed } from '@angular/core/testing';
import { CommandService } from '@app/drawing/services/command.service';

describe('CommandServiceService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: CommandService = TestBed.inject(CommandService);
        expect(service).toBeTruthy();
    });
});

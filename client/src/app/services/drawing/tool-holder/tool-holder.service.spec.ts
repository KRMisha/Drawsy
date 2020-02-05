import { TestBed } from '@angular/core/testing';

import { ToolHolderService } from './tool-holder.service';

describe('ToolHolderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToolHolderService = TestBed.get(ToolHolderService);
    expect(service).toBeTruthy();
  });
});

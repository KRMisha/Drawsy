import { TestBed } from '@angular/core/testing';

import { ToolInputProviderService } from './tool-input-provider.service';

describe('ToolInputProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToolInputProviderService = TestBed.get(ToolInputProviderService);
    expect(service).toBeTruthy();
  });
});

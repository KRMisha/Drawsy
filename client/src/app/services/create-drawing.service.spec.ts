import { TestBed } from '@angular/core/testing';

import { CreateDrawingService } from './create-drawing.service';

describe('CreateDrawingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateDrawingService = TestBed.get(CreateDrawingService);
    expect(service).toBeTruthy();
  });
});

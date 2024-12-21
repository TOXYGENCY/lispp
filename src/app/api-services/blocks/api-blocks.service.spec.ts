import { TestBed } from '@angular/core/testing';

import { ApiBlocksService } from './api-blocks.service';

describe('ApiBlocksService', () => {
  let service: ApiBlocksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiBlocksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

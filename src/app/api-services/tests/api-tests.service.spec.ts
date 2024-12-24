import { TestBed } from '@angular/core/testing';

import { ApiTestsService } from './api-tests.service';

describe('ApiTestsService', () => {
  let service: ApiTestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiTestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

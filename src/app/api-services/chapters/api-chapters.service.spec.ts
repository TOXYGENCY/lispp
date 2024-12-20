import { TestBed } from '@angular/core/testing';

import { ApiChaptersService } from './api-chapters.service';

describe('ApiChaptersService', () => {
  let service: ApiChaptersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiChaptersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ApiAnswersService } from './api-answers.service';

describe('ApiAnswersService', () => {
  let service: ApiAnswersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiAnswersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

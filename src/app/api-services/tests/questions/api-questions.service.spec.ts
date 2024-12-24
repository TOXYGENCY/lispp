import { TestBed } from '@angular/core/testing';

import { ApiQuestionsService } from './api-questions.service';

describe('ApiQuestionsService', () => {
  let service: ApiQuestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiQuestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

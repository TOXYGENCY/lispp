import { TestBed } from '@angular/core/testing';

import { ApiParagraphsService } from './api-paragraphs.service';

describe('ApiParagraphsService', () => {
  let service: ApiParagraphsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiParagraphsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

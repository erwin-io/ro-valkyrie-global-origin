import { TestBed } from '@angular/core/testing';

import { UrlFileServiceService } from './url-file-service.service';

describe('UrlFileServiceService', () => {
  let service: UrlFileServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlFileServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { LauncherService } from './launcher.service';

describe('LauncherServiceService', () => {
  let service: LauncherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LauncherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { IsAnonymousUserGuard } from './is-anonymous-user.guard';

describe('IsAnonymousUserGuard', () => {
  let guard: IsAnonymousUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsAnonymousUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

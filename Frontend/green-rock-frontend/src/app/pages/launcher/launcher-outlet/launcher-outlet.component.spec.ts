import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LauncherOutletComponent } from './launcher-outlet.component';

describe('LauncherOutletComponent', () => {
  let component: LauncherOutletComponent;
  let fixture: ComponentFixture<LauncherOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LauncherOutletComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LauncherOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

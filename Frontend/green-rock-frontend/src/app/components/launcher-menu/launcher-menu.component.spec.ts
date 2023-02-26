import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LauncherMenuComponent } from './launcher-menu.component';

describe('LauncherMenuComponent', () => {
  let component: LauncherMenuComponent;
  let fixture: ComponentFixture<LauncherMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LauncherMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LauncherMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

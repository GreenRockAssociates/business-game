import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOutletComponent } from './game-outlet.component';

describe('GameOutletComponent', () => {
  let component: GameOutletComponent;
  let fixture: ComponentFixture<GameOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameOutletComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

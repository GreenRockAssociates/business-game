import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetBuySellComponent } from './asset-buy-sell.component';

describe('AssetBuySellComponent', () => {
  let component: AssetBuySellComponent;
  let fixture: ComponentFixture<AssetBuySellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetBuySellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetBuySellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

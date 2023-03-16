import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetNewsListComponent } from './asset-news-list.component';

describe('AssetNewsListComponent', () => {
  let component: AssetNewsListComponent;
  let fixture: ComponentFixture<AssetNewsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetNewsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetNewsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

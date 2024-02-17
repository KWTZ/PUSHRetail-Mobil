import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesResultComponent } from './sales-result.component';

describe('SalesResultComponent', () => {
  let component: SalesResultComponent;
  let fixture: ComponentFixture<SalesResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

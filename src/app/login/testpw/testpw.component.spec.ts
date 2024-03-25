import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestpwComponent } from './testpw.component';

describe('TestpwComponent', () => {
  let component: TestpwComponent;
  let fixture: ComponentFixture<TestpwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestpwComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestpwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

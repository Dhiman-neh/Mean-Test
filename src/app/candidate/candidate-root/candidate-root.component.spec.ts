import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateRootComponent } from './candidate-root.component';

describe('CandidateRootComponent', () => {
  let component: CandidateRootComponent;
  let fixture: ComponentFixture<CandidateRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateRootComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

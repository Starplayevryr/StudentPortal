import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentrecordsComponent } from './studentrecords.component';

describe('StudentrecordsComponent', () => {
  let component: StudentrecordsComponent;
  let fixture: ComponentFixture<StudentrecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentrecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentrecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

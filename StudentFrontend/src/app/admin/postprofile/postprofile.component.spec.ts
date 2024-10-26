import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostprofileComponent } from './postprofile.component';

describe('PostprofileComponent', () => {
  let component: PostprofileComponent;
  let fixture: ComponentFixture<PostprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

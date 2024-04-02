import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RecipeModalComponent } from './recipe-modal.component';

describe('RecipeModalComponent', () => {
  let component: RecipeModalComponent;
  let fixture: ComponentFixture<RecipeModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeModalComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

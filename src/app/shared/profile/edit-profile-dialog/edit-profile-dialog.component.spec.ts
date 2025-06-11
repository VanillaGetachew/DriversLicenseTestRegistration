import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProfileDialogComponent } from './edit-profile-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';

describe('EditProfileDialogComponent', () => {
  let component: EditProfileDialogComponent;
  let fixture: ComponentFixture<EditProfileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProfileDialogComponent, ReactiveFormsModule, MaterialModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { userData: {}, section: 'all' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserDataService } from '../../../core/services/user-data.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule]
})
export class RegistrationFormComponent implements OnInit {
  registrationForm: FormGroup;
  photoFile: File | null = null;
  photoPreviewUrl: string | null = null;
  
  // Document upload properties
  documentFiles: { [key: string]: File | null } = {
    idCard: null,
    birthCertificate: null,
    medicalCertificate: null,
    educationCertificate: null
  };
  
  idCardPreviewUrl: string | null = null;
  birthCertificatePreviewUrl: string | null = null;
  medicalCertificatePreviewUrl: string | null = null;
  educationCertificatePreviewUrl: string | null = null;
  
  // Dialog control
  showDocumentsDialog = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private userDataService: UserDataService
  ) {
    this.registrationForm = this.fb.group({
      // Personal Information
      firstNameAmharic: ['', Validators.required],
      fatherNameAmharic: ['', Validators.required],
      grandfatherNameAmharic: ['', Validators.required],
      firstName: ['', Validators.required],
      fatherName: ['', Validators.required],
      grandfatherName: ['', Validators.required],
      sex: ['', Validators.required],
      birthDate: ['', Validators.required],
      birthPlace: ['', Validators.required],
      bloodType: ['', Validators.required],
      nationality: ['', Validators.required],
      education: ['', Validators.required],
      
      // Contact & Address
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      region: ['', Validators.required],
      town: ['', Validators.required],
      woreda: ['', Validators.required],
      kebele: ['', Validators.required],
      houseNo: [''],
      
      // License Information
      licenseGrade: ['', Validators.required],
      nationalId: ['', Validators.required],
      englishExam: [false],
      
      // Photo
      photo: [''],
      
      // Required documents validation controls
      idCardUploaded: [false, Validators.requiredTrue],
      birthCertificateUploaded: [false, Validators.requiredTrue],
      medicalCertificateUploaded: [false, Validators.requiredTrue],
      educationCertificateUploaded: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
  }
  
  // Open the documents upload dialog
  openDocumentsUploadDialog(): void {
    this.showDocumentsDialog = true;
    // Prevent scrolling on the body while dialog is open
    document.body.style.overflow = 'hidden';
  }
  
  // Close the documents upload dialog
  closeDocumentsDialog(): void {
    this.showDocumentsDialog = false;
    // Restore scrolling on the body
    document.body.style.overflow = '';
  }
  
  // Get the count of uploaded documents
  getDocumentUploadCount(): number {
    let count = 0;
    if (this.idCardPreviewUrl) count++;
    if (this.birthCertificatePreviewUrl) count++;
    if (this.medicalCertificatePreviewUrl) count++;
    if (this.educationCertificatePreviewUrl) count++;
    return count;
  }
  
  // Get CSS class based on upload status
  getDocumentUploadStatusClass(): string {
    const count = this.getDocumentUploadCount();
    if (count === 0) return 'none';
    if (count === 4) return 'complete';
    return 'partial';
  }

  triggerPhotoUpload(): void {
    document.getElementById('photoUpload')?.click();
  }

  onPhotoSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      
      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Only JPG or PNG files are allowed');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }
      
      this.photoFile = file;
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Method to trigger document upload by clicking the hidden file input
  triggerDocumentUpload(documentType: string): void {
    document.getElementById(`${documentType}Upload`)?.click();
  }
  
  // Method to handle document selection
  onDocumentSelected(event: Event, documentType: string): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      
      // Validate file type
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        alert('Only JPG, PNG, or PDF files are allowed');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }
      
      // Store the file
      this.documentFiles[documentType] = file;
      
      // Mark this document as uploaded in the form
      this.registrationForm.get(`${documentType}Uploaded`)?.setValue(true);
      
      // Create a preview URL for the file
      const reader = new FileReader();
      reader.onload = () => {
        // Set the appropriate preview URL based on the document type
        switch(documentType) {
          case 'idCard':
            this.idCardPreviewUrl = reader.result as string;
            break;
          case 'birthCertificate':
            this.birthCertificatePreviewUrl = reader.result as string;
            break;
          case 'medicalCertificate':
            this.medicalCertificatePreviewUrl = reader.result as string;
            break;
          case 'educationCertificate':
            this.educationCertificatePreviewUrl = reader.result as string;
            break;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Method to remove a document
  removeDocument(documentType: string, event: Event): void {
    event.stopPropagation(); // Prevent triggering the upload again
    
    // Clear the file and preview
    this.documentFiles[documentType] = null;
    
    // Mark this document as not uploaded in the form
    this.registrationForm.get(`${documentType}Uploaded`)?.setValue(false);
    
    // Clear the appropriate preview URL based on the document type
    switch(documentType) {
      case 'idCard':
        this.idCardPreviewUrl = null;
        break;
      case 'birthCertificate':
        this.birthCertificatePreviewUrl = null;
        break;
      case 'medicalCertificate':
        this.medicalCertificatePreviewUrl = null;
        break;
      case 'educationCertificate':
        this.educationCertificatePreviewUrl = null;
        break;
    }
  }
  
  // Helper method to check if a file is an image
  isImageFile(file: File | null): boolean {
    return file !== null && ['image/jpeg', 'image/png'].includes(file.type);
  }
  
  // Helper method to check if a file is a PDF
  isPdfFile(file: File | null): boolean {
    return file !== null && file.type === 'application/pdf';
  }

  resetForm(): void {
    this.registrationForm.reset();
    this.photoFile = null;
    this.photoPreviewUrl = null;
    
    // Reset document files and previews
    this.documentFiles = {
      idCard: null,
      birthCertificate: null,
      medicalCertificate: null,
      educationCertificate: null
    };
    
    this.idCardPreviewUrl = null;
    this.birthCertificatePreviewUrl = null;
    this.medicalCertificatePreviewUrl = null;
    this.educationCertificatePreviewUrl = null;
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const formData = {
        ...this.registrationForm.value,
        photoUrl: this.photoPreviewUrl, // Store the data URL for the image preview
        documentPreviews: {
          idCard: this.idCardPreviewUrl,
          birthCertificate: this.birthCertificatePreviewUrl,
          medicalCertificate: this.medicalCertificatePreviewUrl,
          educationCertificate: this.educationCertificatePreviewUrl
        }
      };
      
      // Save the user data to the service
      this.userDataService.setUserData(formData);
      
      console.log('Form submitted:', formData);
      
      // Navigate to profile page instead of dashboard
      this.router.navigate(['/profile']);
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registrationForm.controls).forEach(field => {
        const control = this.registrationForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }
}

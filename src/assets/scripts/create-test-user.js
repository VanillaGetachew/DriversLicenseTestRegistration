/**
 * This script creates a test user with license data.
 * It can be executed from the browser console.
 * Usage: Copy-paste this entire script into the browser console on any page of the application
 */

(function() {
  // Create user data object
  const testUserData = {
    // Personal Information
    firstNameAmharic: 'ሃይሌ',
    fatherNameAmharic: 'ገብረ',
    grandfatherNameAmharic: 'ስላሴ',
    firstName: 'Haile',
    fatherName: 'Gebre',
    grandfatherName: 'Selassie',
    sex: 'Male',
    birthDate: '1990-05-15',
    birthPlace: 'Addis Ababa',
    bloodType: 'O+',
    nationality: 'ethiopian',
    education: 'tertiary',
    
    // Contact & Address
    phoneNumber: '0912345678',
    region: 'addisAbaba',
    town: 'Bole',
    woreda: '03',
    kebele: '07',
    houseNo: '123',
    
    // License Information
    licenseGrade: 'B',
    nationalId: 'ETH1234567890',
    englishExam: true,
    
    // Photo URL (placeholder)
    photoUrl: null,
    
    // Simulate license data
    licenseData: {
      id: 12345,
      userId: 1001,
      licenseType: 'B', // Current license grade
      licenseNumber: 'ET-DL-123456',
      issueDate: '2022-01-15',
      expiryDate: '2027-01-14',
      status: 'Active'
    },
    
    // Document previews (placeholders)
    documentPreviews: {
      idCard: null,
      birthCertificate: null,
      medicalCertificate: null,
      educationCertificate: null
    }
  };
  
  // Store data in localStorage
  localStorage.setItem('user_registration_data', JSON.stringify(testUserData));
  
  // Also store license data if needed
  localStorage.setItem('user_license_data', JSON.stringify(testUserData.licenseData));
  
  console.log('✅ Test user successfully created!');
  console.log('Navigate to the profile page to see user details.');
  console.log('Navigate to license-upgrade to test upgrading the license.');
})();
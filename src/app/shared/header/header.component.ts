import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { AuthService } from '../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() sidebarToggled = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  toggleSidebar(): void {
    this.sidebarToggled.emit();
  }

  changePassword(): void {
    // You can implement a dialog for password change here
    alert('Change Password functionality to be implemented');
    // Alternative approach would be to use a dialog:
    // this.dialog.open(ChangePasswordDialogComponent);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, delay, catchError } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  private apiUrl = `${environment.apiUrl}/auth`;

  // Default credentials for testing
  private readonly DEFAULT_USERNAME = 'admin';
  private readonly DEFAULT_PASSWORD = 'password';
  private readonly MOCK_USER: User = {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  };
  private readonly MOCK_TOKEN = 'mock-jwt-token';

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedToken = localStorage.getItem(this.TOKEN_KEY);
    const storedUser = localStorage.getItem(this.USER_KEY);
    
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        user.token = storedToken;
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user', error);
        this.logout();
      }
    }
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    // For development/testing, use mock login with default credentials
    if (loginRequest.username === this.DEFAULT_USERNAME && 
        loginRequest.password === this.DEFAULT_PASSWORD) {
      return this.mockLogin();
    }

    // For production, use actual API
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        catchError(error => {
          console.error('Login failed', error);
          return throwError(() => new Error('Login failed. Please check your credentials.'));
        }),
        tap(response => this.handleSuccessfulLogin(response))
      );
  }

  private mockLogin(): Observable<LoginResponse> {
    const mockResponse: LoginResponse = {
      user: {...this.MOCK_USER},
      token: this.MOCK_TOKEN
    };

    return of(mockResponse)
      .pipe(
        delay(800), // Simulate network delay
        tap(response => this.handleSuccessfulLogin(response))
      );
  }

  private handleSuccessfulLogin(response: LoginResponse): void {
    const user = response.user;
    user.token = response.token;
    
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, {
      oldPassword,
      newPassword
    });
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  get authToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}

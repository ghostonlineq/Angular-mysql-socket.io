import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CRUDService } from './../../service/crud.service';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { AuthUserService } from './../../service/auth-user.service';
import { TokenStorageService } from './../../service/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLogin: boolean = false;
  Loginform: FormGroup


  errorMessage = '';
  // roles: string[] = [];

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private authService: AuthUserService,
    private crudService: CRUDService,
    private tokenStorage: TokenStorageService
  ) {
    this.Loginform = this.formBuilder.group ({
      Email: [''],
      Password: [''],
    });
  }
  ngOnInit(): void {
    // let token=localStorage.getItem('token');
  }

  onRegisterClick() {
    this.ngZone.run(() => this.router.navigateByUrl('/register'));
  }
  onLogin() {
    const { Email, Password } = this.Loginform.value;
    this.authService.Login(Email, Password).subscribe((data) => {
      this.isLogin = data.status
      if(this.isLogin){
        console.log(this.isLogin);
        this.ngZone.run(() => this.router.navigateByUrl('/chat'));
      }
      else{
        alert("Email or Password is incorrect!");
      }

    },
    // err => {
    //   this.errorMessage = err.error.message;
    //   this.isLogin = false

    // }
    );
  }
  reloadPage(){
    window.location.reload();
  }
}

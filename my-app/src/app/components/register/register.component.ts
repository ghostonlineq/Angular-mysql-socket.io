import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CRUDService } from './../../service/crud.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  Genders : Array<any> = []
  TitleNames: Array<any> = []
  Status: Array<any> = []

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private crudService: CRUDService
  ) {
    this.registerForm = this.formBuilder.group({
      Name: [''],
      Password: [''],
      Email: [''],
      Phone: [''],
      Gender: [],
      Titlename: [],
      Status: [],
    });
  }

  ngOnInit(): void {

    this.getGenders()
    this.getStatus()
    this.getTitleNames()
  }

  onSummit(): any {
    // const{Name,Password,Email,Phone,gender,titleName,status} = this.registerForm.value
    this.crudService.Add_User(this.registerForm.value).subscribe(
      data => {
        console.log(data);
        console.log('Register successfully');
        this.registerForm.reset();
      },
      err => {
        console.log("error");
      }
    );
  }
  getGenders(): any{
    this.crudService.GetGender().subscribe(
      (data)=>{
        console.log(data)
        this.Genders = data
        console.log(this.Genders)
      }
    )
  }

  getTitleNames(): any{
    this.crudService.GetTitleName().subscribe(
      (data)=>{
        console.log(data)
        this.TitleNames = data
        console.log(this.TitleNames)
      }
    )
  }

  getStatus(): any{
    this.crudService.GetStatus().subscribe(
      (data)=>{
        console.log(data)
        this.Status = data
        console.log(this.Status)
      }
    )
  }
}

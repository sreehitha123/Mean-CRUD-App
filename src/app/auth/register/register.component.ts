import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '../auth.service';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form : FormGroup;
  createForm(){
    this.form = this.formBuilder.group({
      
      firstname:'',
      lastname:'',
      email:'',
      password:''
      
    })
  }
  constructor(private formBuilder: FormBuilder, private authService:AuthService, private router:Router) { 
    this.createForm();
  }
  Register(){
    console.log(this.form.get("email").value);
    console.log(this.form.get("password").value);
    const user = {
      firstname: this.form.get("firstname").value,
     lastname: this.form.get("lastname").value,
      email:this.form.get("email").value,
      password:this.form.get("password").value
   
  }
  this.authService.addUser(user).subscribe(data=>{
    console.log(data);
   
  });
}
  ngOnInit() {
  }

}

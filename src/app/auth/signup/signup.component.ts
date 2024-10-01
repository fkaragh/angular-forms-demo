import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// let initialEmailValue = '';
// const savedForm = window.localStorage.getItem('saved-login-form');

// if(savedForm){
//   const loadedForm = JSON.parse(savedForm);
//   initialEmailValue = loadedForm;
// }

function equalValues(controlName1:string, controlName2:string){
  return (control: AbstractControl) => {
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;

  if (val1 === val2){
    return null;
  }
  
  return { passwordsNotEqual:true };
  };
  
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit{
  private destroyRef = inject(DestroyRef);

  form = new FormGroup({
    email: new FormControl('', {
      validators:[Validators.email, Validators.required]
    }),
    passwords: new FormGroup({
      password: new FormControl('', {
        validators:[Validators.minLength(6), Validators.required]
      }),
      confirmPassword: new FormControl('',{
        validators:[Validators.minLength(6), Validators.required]
      }),
      },
      {
        validators: [equalValues('password','confirmPassword')],
      }
    ),
    firstName: new FormControl('',{validators:[Validators.required]}),
    lastName: new FormControl('',{validators:[Validators.required]}),
    address: new FormGroup({
      street: new FormControl('',{validators:[Validators.required]}),
      number: new FormControl('',{validators:[Validators.required]}),
      postalCode: new FormControl('',{validators:[Validators.required]}),
      city: new FormControl('',{validators:[Validators.required]}),
    }),
    role: new FormControl<'student' | 'teacher' | 'employee' | 'founder' | 'other'>('student',{validators:[Validators.required]}),
    source: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]),
    agree: new FormControl(false,{validators:[Validators.required]}),
  })

  // get emailIsInvalid(){
  //   return (this.form.controls.email.invalid && this.form.controls.email.touched && this.form.controls.email.dirty);
  // }
  
  // get passwordIsInvalid(){
  //   return (this.form.controls.password.invalid && this.form.controls.password.touched && this.form.controls.password.dirty);
  // }

  ngOnInit() {
    const subscription = this.form.valueChanges.subscribe({
      next: value => {
        window.localStorage.setItem('saved-login-form', JSON.stringify({email : value.email}))
      }
    });

    this.destroyRef.onDestroy(()=>{
      subscription.unsubscribe();
    })
  }

  onSubmit(){
    if(this.form.invalid){
      console.log('INVALID FORM');
      return;
    }
  }

  onReset(){
    this.form.reset();
  }
}

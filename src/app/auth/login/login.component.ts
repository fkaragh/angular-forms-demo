///////////////////////// TEMPLATE-DRIVEN FORM APPROACH ///////////////////////////////////

// import { afterNextRender, Component, DestroyRef, inject, viewChild } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { debounceTime } from 'rxjs';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css',
// })
// export class LoginComponent {
//   private form = viewChild.required<NgForm>('form');
//   private destroyRef = inject(DestroyRef);

//   constructor(){
//     afterNextRender(() => {
//       const savedForm =  window.localStorage.getItem('saved-login-form');

//       if (savedForm){
//         const loadedFormData = JSON.parse(savedForm);
//         const savedEmail = loadedFormData.email;
//         setTimeout(() => { //to wait for the form to be initialized
//           // this.form().setValue({
//           //   email: savedEmail,
//           //   password: '',
//           // });
//           this.form().controls['email'].setValue(savedEmail);
//         }, 1);
        
//       }

//       const subscription = this.form().valueChanges?.pipe(debounceTime(500)).subscribe({
//         next: (value) => window.localStorage.setItem('saved-login-form', JSON.stringify({email: value.email}))
//       });

//       this.destroyRef.onDestroy(() => subscription?.unsubscribe());

//     });
//   }

//   onSubmit(formData: NgForm){
//     if(formData.form.invalid){
//       return;
//     }

//     const enteredEmail = formData.form.value.email;
//     const enteredPassword = formData.form.value.password;

//     console.log(enteredEmail, enteredPassword);

//     formData.form.reset();
//   }
// }

///////////////////////// END OF TEMPLATE-DRIVEN FORM APPROACH ///////////////////////////////////

import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, of } from 'rxjs';

function mustContainQuestionMark(control: AbstractControl){
  if(control.value.includes('?')){
    return null;
  }

  return { doesNotContainQuestionMark: true };
}

function emailIsUnique(control: AbstractControl){
  if(control.value !== 'test@example.com'){
    return of(null);
  }

  return of({notUnique: true});
}

let initialEmailValue = '';
const savedForm = window.localStorage.getItem('saved-login-form');

if(savedForm){
  const loadedForm = JSON.parse(savedForm);
  initialEmailValue = loadedForm.email;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit{
  private destroyRef = inject(DestroyRef);
  form = new FormGroup({
    email: new FormControl(initialEmailValue, {
      validators: [Validators.email, Validators.required],
      asyncValidators: [emailIsUnique],
    }),
    password: new FormControl('',{
      validators: [Validators.minLength(6), Validators.required, mustContainQuestionMark],
    })
  });

  get emailIsInvalid(){
    return (this.form.controls.email.touched && this.form.controls.email.dirty && this.form.controls.email.invalid);
  }

  get passwordIsInvalid(){
    return (this.form.controls.password.touched && this.form.controls.password.dirty && this.form.controls.password.invalid);
  }
  
  ngOnInit() {
    // const savedForm = window.localStorage.getItem('saved-login-form');
    // if(savedForm){
    //   const loadedForm = JSON.parse(savedForm);
    //   this.form.patchValue({
    //     email: loadedForm.email,
    //     password: '',

    //   });
    // }

    const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({
      next: value => {
        window.localStorage.setItem('saved-login-form', JSON.stringify({email: value.email}))
      }
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe())
  }

  onSubmit(){
    const enteredEmail = this.form.controls.email;
    const enteredPassword = this.form.controls.password;
  }

}
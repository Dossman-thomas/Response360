// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent {
//   loginForm: FormGroup;
//   isSubmitted = false;

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private toastr: ToastrService
//   ) {
//     this.loginForm = this.fb.group({
//       UserName: ['', Validators.required],
//       Password: ['', Validators.required]
//     });
//   }

//   onSubmit() {
//     this.isSubmitted = true;
//     if (this.loginForm.invalid) {
//       return;
//     }

//     this.authService.login(
//       this.loginForm.controls.UserName.value,
//       this.loginForm.controls.Password.value
//     ).subscribe(
//       (res: any) => {
//         if (res?.Status == 1) {
//           this.toastr.success(res.Message, 'Success');
//           // Store user information in local storage
//         }
//       },
//       (error) => {
//         this.toastr.error('Login failed', 'Error');
//       }
//     );
//   }
// }

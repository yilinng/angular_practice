import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/** A user's email can't match the given regular expression */
export function forbiddenEmailValidator(email: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = validMail(control.value);
    return forbidden ? {email: {value: control.value}} : null;
  };
}

export function validMail(mail: string){
  return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(mail);
}
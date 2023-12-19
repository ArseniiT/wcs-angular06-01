import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-search-movie',
  templateUrl: './search-movie.component.html',
  styleUrls: ['./search-movie.component.css']
})
export class SearchMovieComponent implements OnInit{
  myForm!: FormGroup;
  currentYear: number = new Date().getFullYear();
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      Type: [EnumType.série],
      'Année de sortie': [
        this.currentYear,
        [Validators.required, this.rangeDateValidator(1900, this.currentYear)]
      ],
      Fiche: [''],
      idAndTitre: this.formBuilder.group({
        Identifiant: ['', this.isRequiredValidator('Titre', 'Identifiant')],
        Titre: ['', this.isRequiredValidator('Identifiant', 'Titre')],
      })
    });

    this.myForm.patchValue({
      Fiche: EnumFiche.courte
    });

    // this.myForm.get('type')?.setValue('série');
    // this.myForm.get('fiche')?.patchValue('courte');
  }

  isRequiredValidator(control1: string, control2: string) {
    return (group: AbstractControl): ValidationErrors | null => {
      const titreControl = group.get(control1);
      const identifiantControl = group.get(control2);

      if (!titreControl?.value && !identifiantControl?.value) {
        return { isRequired: true };
      }

      return null;
    };
  }

  rangeDateValidator(minYear: number , maxYear: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // parse control value to int
      const year = parseInt(control.value);
      // check if year is less than minimum
      if (year <= minYear) {
        return { 'min': { value: control.value, expected: minYear } };
      }
      // check if year is greater than maximum
      if (year >= maxYear) {
        return { 'max': { value: control.value, expected: maxYear } };
      }
      return null;
    };
  };

  onSubmit() {
    if (this.myForm.valid) {
      console.log('Form submitted:', this.myForm.value);
    } else {
      this.errorMessage = "Please fix the errors in the form.";
    }
  }

}

enum EnumType {
  film = 'film',
  série = 'série',
  épisode = 'épisode',
}

enum EnumFiche {
  complète = 'complète',
  courte = 'courte',
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MyFormModel } from '../model/my-form.model';

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
        Identifiant: [''],
        Titre: ['']
      }, { validators: this.isRequiredValidator('Identifiant', 'Titre') }),
    });

    this.myForm.patchValue({
      Fiche: EnumFiche.courte
    });

    // this.myForm.valueChanges.subscribe(x => console.log(this.myForm.controls));
    this.myForm.valueChanges.subscribe(x => {
      // console.log(this.myForm)
      // console.log(this.myForm.controls)
    });
  }

  isRequiredValidator(controlName1: string, controlName2: string) {
    return (group: AbstractControl): ValidationErrors | null => {
      const titreControl = group.get(controlName1);
      const identifiantControl = group.get(controlName2);

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
      // check if year is less than minimum or greater than maximum
      if (year < minYear || year > maxYear) {
        return { 'min': { minimale: minYear, maximale: maxYear }};
      }
      return null;
    };
  };

  onSubmit() {
    console.log('Form submitted:');
    console.log(this.myForm.value as MyFormModel);
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

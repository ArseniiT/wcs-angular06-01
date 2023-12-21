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
  startYear = 1900;
  currentYear: number = new Date().getFullYear();
  errorMessage: string = '';
  submitted = false;
  enumType = EnumType;
  enumFiche = EnumFiche;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      // La valeur par défaut du Type doit être valorisée à l'initialisation du contrôle avec la valeur séries
      Type: [EnumType.série],
      'Année de sortie': [
        this.currentYear,
        [Validators.required, this.rangeDateValidator(this.startYear, this.currentYear)]
      ],
      Fiche: [''],
      // Les deux champs Identifiant et Titre doivent être un FormGroup imbriqué
      idAndTitre: this.formBuilder.group({
        Identifiant: [''],
        Titre: ['']
      }, { validators: this.isRequiredValidator('Identifiant', 'Titre') }),
    });

    // La valeur par défaut de Fiche doit être valorisée via .patchValue() avec la valeur courte
    this.myForm.patchValue({
      Fiche: EnumFiche.courte
    });

    // Souscris aux changements des contrôles avec .valueChages et affiche la valeur dans la console
    this.myForm.valueChanges.subscribe(x => console.log(this.myForm.controls));
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
    // Les messages d'erreur de validation doivent être affichés uniquement après l'envoi du formulaire
    this.submitted = true;
    console.log(this.myForm.value as MyFormModel);
  }

}

export enum EnumType {
  film = 'film',
  série = 'série',
  épisode = 'épisode',
}

enum EnumFiche {
  complète = 'complète',
  courte = 'courte',
}

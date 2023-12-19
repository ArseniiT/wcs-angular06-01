import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-movie',
  templateUrl: './search-movie.component.html',
  styleUrls: ['./search-movie.component.css']
})
export class SearchMovieComponent implements OnInit{
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      Type: [EnumType.série],
      'Année de sortie': [''],
      Fiche: [''],
      id: this.formBuilder.group({
        Identifiant: [''],
        Titre: [''],
      }, { validators: Validators.required })
    });

    this.form.patchValue({
      Fiche: EnumFiche.courte
    });
  }

  isRequiredValidator() {
    
  }

  rangeDateValidator() {

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

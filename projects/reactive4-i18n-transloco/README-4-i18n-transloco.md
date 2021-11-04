# My-Validators with i18N messages

For i18n I use transloco.

        npm i @ngneat/transloco

Since we do NOT depend on @gpeel/my-validators to connect our ValidatorService to transloco we can design anything we
want. I just give here "a" way of doing it.

## transloco setup

I have defined 2 files under src/assets/i18n/validators

en.json

````json
{
  "pristineForm": "Your form is pristine! No action executed",
  "invalidForm": "You must correct your form before saving it",
  "forbiddenName": "The word {{forbiddenName}} is forbidden !",
  "email": "this field should be a valid email",
  "required": "The field is required",
  "requiredTrue": "This field should be true",
  "max": "This number should be at least  {{max}}",
  "min": "This number should be at most {{min}}",
  "minlength": "The length should be at least {{requiredLength}}",
  "maxlength": "The length should be less that {{requiredLength}}",
  "pattern": "This field should respect the pattern {{requiredPattern}}"
}
````

And fr.json

````json
{
  "pristineForm": "Le formulaire est inchangé. Pas d'action executée !",
  "invalidForm": "Vous devez corriger le formulaire pour qu'il soit soumis !",
  "forbiddenName": "le mot {{forbiddenName}} est interdit",
  "email": "le champ doit être un email valide",
  "required": "le champ est requis",
  "requiredTrue": "le champ doit être coché",
  "max": "le nombre doit être au moins {{max}}",
  "min": "le nombre doit être au plus {{min}}",
  "minlength": "le nombre de caractères doit être supérieur à {{requiredLength}}",
  "maxlength": "le nombre de caractères doit être inférieur à  {{requiredLength}}",
  "pattern": "le champ doit respecter le pattern {{requiredPattern}}"
}
````

Also look at src/app/transloco for a TranslocoRootModule seting things up for the project.

## Project impact to migrate to i18n

There is very few things to wire up. From example reactive3-flexible-validators just connect our MessageService called
TypicalMessageService to transloco.

I change the name of the service so I18nMessageService.

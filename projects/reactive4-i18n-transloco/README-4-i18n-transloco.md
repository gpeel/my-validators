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
  "forbiddenName": "TRANSLOCO! The word {{forbiddenName}} is forbidden !",
  "email": "TRANSLOCO! this field should be a valid email valid",
  "required": "TRANSLOCO! The field is required",
  "requiredTrue": "TRANSLOCO! This field should be true",
  "max": "TRANSLOCO! This number should be at least  {{max}}",
  "min": "TRANSLOCO! This number should be at most {{min}}",
  "minlength": "TRANSLOCO! The length should be at least {{requiredLength}}",
  "maxlength": "TRANSLOCO! The length should be less that {{requiredLength}}",
  "pattern": "TRANSLOCO! This field should respect the pattern {{requiredPattern}}"
}

````

And fr.json

````json
{
  "forbiddenName": "TRANSLOCO! le mot {{forbiddenName}} est interdit",
  "email": "TRANSLOCO! le champ doit être un email valid",
  "required": "TRANSLOCO! le champ est requis",
  "requiredTrue": "TRANSLOCO! le champ doit être true",
  "max": "TRANSLOCO! le nombre doit être au moins {{max}}",
  "min": "TRANSLOCO! le nombre doit être au plus {{min}}",
  "minlength": "TRANSLOCO! le nombre de caractères doit être supérieur à {{requiredLength}}",
  "maxlength": "TRANSLOCO! le nombre de caractères doit être inférieur à  {{requiredLength}}",
  "pattern": "TRANSLOCO! le champ doit respecter le pattern {{requiredPattern}}"
}


````

Also look at src/app/transloco for a TranslocoRootModule seting things up for the project.

## Project impact to migrate to i18n

There is very few things to wire up. From example reactive3-flexible-validators just connect our MessageService called
TypicalMessageService to transloco.

I change the name of the service so I18nMessageService.

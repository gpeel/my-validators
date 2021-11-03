# Using my-validators : simplest

        npm i @gpeel/my-validators

my-validators requires a simple logger @gpeel/plog to enable/disable the output of validators.

It is installed by defeult as a dependency by @gpeel/my-validators, but is not active until you declare in your Module.

## my validators simplest example:

## Plog install in your main project (OPTIONNAL)

In your main project do an explicit install:

        npm i @gpeel/plog

And declare :

        PlogModule.forRoot(environment) // <<< HERE, takes into account you loggers definition in environment.ts

## PROD environment.prod.ts

Your ./environments/environments.ts and environments-prod.ts would typically look like :

````typescript

export const environment = {
  production: false,
  plog: {
    error: 'color:red',
    warn: 'color:orange',
    // info: 'color:blue',
    // debug: 'color:limegreen;font-weight:bold',
  }
};
````

## DEV environment.ts

And your developpment environment.ts would typically activate much more loggers (here all are activated) :

````typescript
export const environment = {
  production: false,
  plog: {
    debug: 'color:limegreen;font-weight:bold',
    info: 'color:blue',
    error: 'color:red',
    warn: 'color:orange',

    // NG hooks
    ngOnChanges: ['color:orange', 'OnChange'],
    ngOnInit: ['color:orange', 'OnInit'],
    ngOnDestroy: ['color:orange', 'OnDestroy'],
    ngDoCheck: ['color:orange', 'DoCheck'],
    ngAfterContentInit: ['color:orange', 'AfterContentInit'],
    ngAfterContentChecked: ['color:orange', 'AfterContentChecked'],
    ngAfterViewInit: ['color:orange', 'AfterViewInit'],
    ngAfterViewChecked: ['color:orange', 'AfterViewChecked'],

    // look at https://github.com/gpeel/plog
    // or at https://www.npmjs.com/package/@gpeel/plog
    // to have the complete list of loggers
  }
};

````

My strategy is to enrich the abstractControl.errors object by the 'msg' property holding the validation message to show
on the UI.

example :

        control.errors : {
          "required": {
            "msg": "the field is required"
          }
        }  

or for minlength:

      control.errors = {
        "minlength": {
          "requiredLength": 3,
          "actualLength": 1,
          "msg": "the length should be more than 3 characters"
      }

In solution-1 I copied the Angular original validators.ts and validators-directive.ts and added the msg property on all
errors for each standard validators:

        { msg  : 'the validation error message' }

I propose better more flexible solutions.

In Solution 2 is a better delegate pattern still containing hard coded error messages

And in Solution 3 a completely customizable solution.

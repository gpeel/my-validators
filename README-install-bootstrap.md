# Settings for this project

## Bootstrap

https://www.techiediaries.com/angular-bootstrap/

## NG or NGX Bootstrap

https://valor-software.com/ngx-bootstrap/#/documentation#getting-started

You have to choose between ngx-bootstrap or ng-bootstrap

        npm install bootstrap

        ng add @ng-bootstrap/ng-bootstrap

OR

            ng add ngx-bootstrap

Extract from https://www.techiediaries.com/angular-bootstrap/

Alternative Step Adding Bootstrap 4 Using ng-bootstrap and ngx-bootstrap Bootstrap depends on the jQuery and popper.js
libraries, and if you don’t include them in your project, any Bootstrap components that rely on JavaScript will not
work.

Why not include those libs? For Angular, it’s better to avoid using libraries that make direct manipulation of the DOM (
like jQuery) and let Angular handle that.

Now, what if you need the complete features of Bootstrap 4 without the JavaScript libraries?

A better way is to use component libraries created for the sake of making Bootstrap work seamlessly with Angular such as
ng-bootstrap andngx-bootstrap

Should I add bootstrap.js or bootstrap.min.js to my project? No, the goal of ng-bootstrap is to completely replace
JavaScript implementation for components. Nor should you include other dependencies like jQuery or popper.js. It is not
necessary and might interfere with ng-bootstrap code Source



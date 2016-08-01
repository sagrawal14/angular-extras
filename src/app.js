'use strict';

angular.module('angular.extras.core', []);
angular.module('angular.extras.event.directives', []);
angular.module('angular.extras.form.directives', []);
angular.module('angular.extras.list.directives', []);
angular.module('angular.extras.page.directives', []);

angular.module('angular.extras.thirdparty.services', []);

angular.module('angular.extras', [
  'angular.extras.core',
  'angular.extras.event.directives',
  'angular.extras.page.directives',
  'angular.extras.form.directives',
  'angular.extras.list.directives',
  'angular.extras.thirdparty.services'
]);
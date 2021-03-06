/* global document */

'use strict';

/**
 * @ngdoc directive
 * @name bodyClasses
 * @description Used to set classes on "body" tag which can be applied on any element. This directive accepts as
 * many as classes and also accepts any scope dynamic variable.
 * @example
 * <code>
 *      <div body-classes="'new-class another-class' {{someScopeVariable}}"></div>
 * </code>
 */
angular.module('angular.extras.page.directives').directive('bodyClasses', function () {
  return {
    restrict: 'A',
    link: function ($scope, element, $attrs) {
      var classes;

      $scope.$watch(function (scope) {
        return scope.$eval($attrs.bodyClasses);
      }, function (value) {
        classes = value;
        angular.element(document.body).addClass(value);
      });

      // Remove body class when scope or directive destroyed.
      $scope.$on('$destroy', function () {
        angular.element(document.body).removeClass(classes);
      });
    }
  };
});

/**
 * @ngdoc directive
 * @name dynamicContent
 * @service $compile
 * @description Used to compile the dynamic HTML content.
 * @example
 * <code>
 *    <div dynamic-content="'Sum of 2 and 3 is {{2+3}}'"></div>
 * <code>
 */
angular.module('angular.extras.page.directives').directive('dynamicContent', ['$compile', function ($compile) {
  return {
    link: function (scope, element, attrs) {
      scope.$watch(function (scope) {
        return scope.$eval(attrs.dynamicContent);
      }, function (value) {
        element.html(value);
        $compile(element.contents())(scope);
      });
    }
  };
}]);
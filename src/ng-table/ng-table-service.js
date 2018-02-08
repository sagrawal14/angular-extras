'use strict';

/* Specific to our personal use across projects */

angular
  .module('angular.extras.thirdparty')
  .factory('AeNgTableService', function (NgTableParams, $q, $location) {

    function _updateParams(ngTableParams, newParams) {
      if (newParams.max) {
        ngTableParams.count(newParams.max);
      }

      if (newParams.page) {
        ngTableParams.page(newParams.page);
      }

      if (newParams.sort) {
        var sorting = {};
        sorting[newParams.sort] = newParams.order || 'asc';
        ngTableParams.sorting(sorting);
      }

      if (newParams.filters) {
        var filters = newParams.filters;

        if (typeof newParams.filters === 'string') {
          try {
            filters = JSON.parse(newParams.filters);
          } catch (e) {
            filters = {};
            console.error('Error parsing filters.', e);
          }
        }

        ngTableParams.filter(filters);
      }
    }

    return {
      getTableParams: function (model, customNgTableParameters, requestParams, settings, callback) {
        settings = settings || {};

        var baseNgTableParameters = {
          page: 1,            // show first page
          count: 10,
          sorting: {
            id: 'asc'
          }
        };

        angular.extend(baseNgTableParameters, customNgTableParameters);

        var initialSettings = {
          getData: function (params) {
            var sorting = params.sorting();
            var sortKey = Object.keys(sorting)[0];
            var order = sorting[sortKey];

            var basicParams = {
              max: params.count(),
              page: params.page(),
              filters: params.filter(),
              sort: sortKey,
              order: order
            };

            if (settings.paramsAsURL) {
              var temporaryParams = angular.copy(basicParams);
              temporaryParams.filters = JSON.stringify(temporaryParams.filters);

              /**
               * For the first time only, replace the current history so that we are not getting the previous URL
               * without parameters when we navigate back. For example: User is at "http://example.com/dashboard" &
               * clicks the link for the user listing page and landed at "http://example.com/users" and due to
               * default filters, the URL will be changed to
               * "http://example.com/users?max=10&page=1&filters=%7B%7D&sort=id&order=asc" but if we don't add this
               * check and hit the back button, user will be taken at "http://example.com/users" and then on the
               * next click user will be taken back to "http://example.com/dashboard" which is not correct. So
               * replacing the history with default parameters.
               */
              if (!params.historyReplaced) {
                $location.replace();
                params.historyReplaced = true;
              }

              $location.search(temporaryParams);
            }

            var deferred = $q.defer();

            var queryParams = angular.extend({}, basicParams, requestParams);
            model.query(queryParams, function (data, headerGetter) {
              var headers = headerGetter();
              params.total(headers['total-count']);

              if (callback) {
                callback(data);
              }

              if (data.result) {
                deferred.resolve(data.result);
              } else {
                deferred.resolve(data);
              }
            }, deferred.reject);

            // Make the API call promise available to the NgTableParams instance for external use
            params.dataPromise = deferred.promise;
            return deferred.promise;
          }
        };

        angular.extend(initialSettings, settings);

        var ngTableParams = new NgTableParams(baseNgTableParameters, initialSettings);

        // Adding an helper method
        ngTableParams.getCurrentSort = function () {
          var currentSort = this.sorting();
          var currentSortKey = Object.keys(currentSort)[0];

          return {sort: currentSortKey, order: currentSort[currentSortKey]};
        };

        if (settings.paramsAsURL) {
          _updateParams(ngTableParams, $location.search());
        }

        return ngTableParams;
      },
      updateParams: _updateParams
    };
  });
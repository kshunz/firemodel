module.exports = function (fb) {

    'use strict';

    fb.prototype.model = function (modelName) {
        var _ = require('lodash');
        var ref = this;
        var dataQueue = [];
        var searchQueue = [];
        var searchHistory = {};
        var findPromise;

        return {

            add: function (record) {

                var action = {};

                action[modelName] = { push: record };

                dataQueue.push(action);

            },

            delete: function (idKey) {

                var searchKey = idKey.split('.');

                searchKey.unshift(modelName);
                searchKey = searchKey.join('/');

                ref.child(searchKey).remove();
            },

            find: function (providedKey, fieldsToReturn) {

                var idKey = fieldsToReturn ? providedKey : '';

                fieldsToReturn = providedKey && !fieldsToReturn && _.isArray(providedKey) ?
                  providedKey : fieldsToReturn;

                fieldsToReturn = fieldsToReturn || [];

                var searchKey = idKey ? idKey.split('.') : [];
                var searchFilter = {};

                searchKey.unshift(modelName);
                searchKey = searchKey.join('/');

                _.forEach(fieldsToReturn, function (field) {
                    searchFilter[field] = true;
                });

                findPromise = ref.child(searchKey).once('value')
                  .then(function (snapshot) {

                    var result = snapshot.val();

                    _.forEach(result, function (val, field) {

                        if (fieldsToReturn.length > 0 && !searchFilter[field]) {
                            delete result[field];
                        }

                    });

                    searchHistory[modelName] = searchQueue.push(result);
                    console.log(searchQueue);

                });
            },

            results: {
                all: function (handleResults) {
                  findPromise
                    .then(function () {
                      handleResults(searchQueue);
                    });

                  return {
                    log: function () {

                    }()
                  };
                },

                first: function (handleResults) {
                  findPromise
                    .then(function () {
                      handleResults(_.first(searchQueue));
                    });
                },

                log: function log (resultType) {

                  resultType = resultType || 'all';

                  var types = { all: true, first: true, nth: true };
                  var typeExists = types[resultType];

                  if(typeExists) {

                    var checkResults = setInterval(function () {
                      if(searchQueue.length > 0) {
                        console.log(searchHistory);
                        console.log.apply(log, searchQueue[modelName]);
                        clearInterval(checkResults);
                      }
                    }, 1000);

                    setTimeout(function () {
                      clearInterval(checkResults);
                    }, 15000);

                  }

                },

                nth: function (n, handleResults) {
                  findPromise
                    .then(function () {
                      handleResults(searchQueue[Number(n) - 1]);
                    });
                }
            },

            save: function () {

                _.forEach(dataQueue, function (data) {

                    var modelName = _.keys(data)[0];
                    var actionRecord = _.values(data)[0];

                    _.forEach(actionRecord, function (record, action) {
                        ref.child(modelName)[action](record);
                    });

                });

            },

            set: function (idKey, newValue) {

                var action = {};
                var searchKey = idKey.split('.');

                searchKey.unshift(modelName);

                searchKey = searchKey.join('/');

                action[searchKey] = { set: newValue };

                dataQueue.push(action);

            },

            update: function (idKey, newValue) {

                var action = {};
                var searchKey = idKey.split('.');

                searchKey.unshift(modelName);

                searchKey = searchKey.join('/');

                action[searchKey] = { set: newValue };

                dataQueue.push(action);

            }

        };

    };


};

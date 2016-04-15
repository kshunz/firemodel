module.exports = function (fb) {

    'use strict';

    fb.prototype.model = function (modelName) {

        var ref = this;
        var dataQueue = [];
        var searchQueue = [];

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

            find: function (idKey, fieldsToReturn) {

                var searchKey = idKey.split('.');
                var searchFilter = {};

                searchKey.unshift(modelName);
                searchKey = searchKey.join('/');

                _.forEach(fieldsToReturn, function (field) {
                    searchFilter[field] = true;
                });

                ref.child(searchKey).once('value', function (snapshot) {

                    var result = snapshot.val();

                    _.forEach(result, function (val, field) {

                        if (!searchFilter[field]) {
                            delete result[field];
                        }

                    });

                    searchQueue.push(result);

                });
            },

            results: {

                all: function () {
                    return searchQueue;
                },

                first: function () {
                    return _.first(searchQueue);
                },

                nth: function (n) {
                    return searchQueue[Number(n) - 1];
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

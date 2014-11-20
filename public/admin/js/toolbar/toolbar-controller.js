(function () {
    'use strict';
    angular.module('app')
        .controller('ToolbarCtrl', ['common', function (common) {

            var toolbar = this;

            toolbar.saveRecord = function () { common.saveRecord(); };
            toolbar.cancel = function () { common.cancel(); };
            toolbar.addItem = function () { common.addItem(); };
            toolbar.editItem = function () { common.editItem(); };
            toolbar.returnToList = function () { common.returnToList(); };
            toolbar.otherAction = function () { common.otherAction(); };

            toolbar.saveButtonEnabled = function () {
                return common.enableSaveButton;
            };

            toolbar.cancelButtonEnabled = function () {
                return common.enableCancelButton;
            };

            toolbar.addButtonEnabled = function () {
                return common.enableAddButton;
            };

            toolbar.editButtonEnabled = function () {
                return common.enableEditButton;
            };

            toolbar.returnButtonEnabled = function () {
                return common.enableReturnButton;
            };

            toolbar.otherButtons = function () {
                return common.otherToolbarButtons;
            };

        }]);
})();
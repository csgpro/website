(function () {
    angular.module('app')
        .service('common', ['CONFIG', 'httpService', '$rootScope', '$location', 'toaster', '$filter', function (CONFIG, httpService, $rootScope, $location, toaster, $filter) {

            var self = this;

            self.enableAddButton = false;
            self.enableEditButton = false;
            self.enableSaveButton = false;
            self.enableCancelButton = false;
            self.enableReturnButton = false;

            self.upperCaseString = function (str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            };

            self.singularString = function (str) {
                var lastChar = str.length - 1;
                var lastThreeChar = str.length - 3;
                var resStr = '';
                if (str.substring(lastChar) === 's') {
                    resStr = str.substring(0, lastChar);
                }
                if (str.substring(lastThreeChar) === 'ies') {
                    resStr = str.substring(0, lastThreeChar) + 'y';
                }
                return resStr;
            };

            self.setSaveRecordData = function (obj) {
                delete self.saveRecordData;
                self.saveRecordData = obj;
            };

            self.saveRecord = function () {
                var endpoint = self.saveRecordData.endpoint,
                    data = self.saveRecordData.data,
                    id = self.saveRecordData.id,
                    method = self.saveRecordData.method,
                    successMessage = self.saveRecordData.successMessage ? self.saveRecordData.successMessage : 'Saved Data',
                    onSuccess = self.saveRecordData.onSuccess ? self.saveRecordData.onSuccess : null;

                if (method === 'put') {
                    return httpService.updateItem(endpoint, id, data).then(function (res) {
                        if (res.errors) {
                            toaster.pop('error', res.errors[0].title);
                        } else {
                            toaster.pop('success', successMessage);
                            if (onSuccess) {
                                onSuccess();
                            }
                        }
                    });
                } else {
                    return httpService.createItem(endpoint, data).then(function (res) {
                        if (res.errors) {
                            toaster.pop('error', res.errors[0].title);
                        } else {
                            toaster.pop('success', successMessage);
                            if (onSuccess) {
                                onSuccess();
                            }
                        }
                    });
                }
            };

            self.setCancel = function (method) {
                this.cancel = method;
            };

            self.cancel = function () {
                var id = $location.path().split('/').pop();
                var path = $location.path();
                var pattern = /\badd\b|\bedit\b/;
                var end = path.search(pattern);
                if (parseInt(id) >= 0) {
                    $location.url(path.substring(0, end) + id);
                } else {
                    $location.url(path.substring(0, end));
                }
            };

            self.setReturnToList = function (method) {
                this.returnToList = method;
            };

            self.returnToList = function () {
                var path = $location.path();
                $location.url(path.substring(0, path.lastIndexOf('/')));
            };

            self.otherToolbarButtons = [];

            self.setupToolbarButtons = function (toolbarButtons) {
                if (typeof toolbarButtons === 'object') {
                    var i = 0;
                    var button;
                    if (toolbarButtons.standardButtons && toolbarButtons.standardButtons.length > 0) {
                        for (i in toolbarButtons.standardButtons) {
                            button = toolbarButtons.standardButtons[i];
                            switch (button) {
                                case 'save':
                                    self.enableSaveButton = true;
                                    break;
                                case 'edit':
                                    self.enableEditButton = true;
                                    break;
                                case 'add':
                                    self.enableAddButton = true;
                                    break;
                                case 'cancel':
                                    self.enableCancelButton = true;
                                    break;
                                case 'return':
                                    self.enableReturnButton = true;
                                    break;
                            }
                        }
                    }

                    if (toolbarButtons.customButtons && toolbarButtons.customButtons.length > 0) {
                        for (i = 0; i < toolbarButtons.customButtons.length; i++) {
                            button = toolbarButtons.customButtons[i];
                            if (!button.condition || button.condition()) {
                                self.otherToolbarButtons.push(button);
                            }
                        }
                    }
                }
            };

            self.goToUrl = function (url) {
                $location.url(url);
            };

            self.viewItem = function (subpath) {
                $location.url($location.path() + '/' + subpath);
            };

            self.deleteItem = function (entity, id, itemArray) {
                httpService.deleteItem(entity, id).then(itemArray.splice(this.$index, 1));
            };

            self.removeItem = function (itemArray) {
                itemArray.splice(this.$index, 1);
            };

            self.addItem = function (route) {
                // Add launch add view
                if (!route) {
                    route = '';
                }
                $location.url($location.path() + route + '/add/new');
            };

            self.editItemRoute = null;

            self.setEditItemRoute = function (route) {
                self.editItemRoute = route;
            };

            self.editItem = function (route) {
                var editPath;
                if (route) {
                    editPath = $location.path() + '/' + route;
                } else if (self.editItemRoute) {
                    editPath = self.editItemRoute;
                } else {
                    var id = $location.path().split('/').pop();
                    editPath = $location.path().substring(0, $location.path().lastIndexOf('/')) + '/edit/' + id;
                }
                $location.url(editPath);
            };

            self.toolbarReset = function () {
                this.saveRecord = self.saveRecord;
                this.cancel = self.cancel;
                this.deleteItem = self.deleteItem;
                this.viewItem = self.viewItem;
                this.enableAddButton = false;
                this.enableEditButton = false;
                this.enableSaveButton = false;
                this.enableCancelButton = false;
                this.enableReturnButton = false;
                this.returnToList = self.returnToList;
                this.secondaryNavTemplate = self.secondaryNavTemplate;
                this.currentViewTitle = self.currentViewTitle;
                this.editItemRoute = self.editItemRoute;
                this.otherToolbarButtons = [];
                this.currentParentEntityId = null;
            };

            self.canEdit = function () {
                var path = $location.path();
                var pattern = /\badd\b|\bedit\b/;
                return path.search(pattern);
            };

            self.revealButtons = function () {
                if (self.canEdit() > 0) {
                    self.enableSaveButton = true;
                    self.enableCancelButton = true;
                } else {
                    self.enableEditButton = true;
                    self.enableReturnButton = true;
                }
            };

            self.secondaryNavTemplate = null;

            self.currentSubPath = function (id) {
                var path = $location.path();
                var subPath = path.split(id).pop();
                return subPath;
            };

            self.setCurrentPageTitle = function (title) {
                $rootScope.pageTitle = title;
            };

            self.routeIsActive = function (r) {
                var routes = Array.isArray(r) ? r.join('|') : r,
                    regexStr = '\/(' + routes + ')',
                    path = new RegExp(regexStr);

                return (r[0] === $location.path()) ? true : path.test($location.path());
            };

            self.setScopeProperty = function (scope, property, getFunction) {
                // Prevent duplication of property
                if (!scope[property]) {
                    Object.defineProperty(scope, property, {
                        get: getFunction
                    });
                }
            };

            self.currentParentEntityId = null;

            self.getQueryStringParams = function () {

                var res = {};

                window.location.search.replace("?", "").split('&').map(

                function (q) {
                    var v = q.split('=');
                    res[v[0]] = v[1];
                });

                return res;
            };

            self.convertToCurrency = function (num) {
                if (parseFloat(num)) {
                    return $filter('currency')(num);
                }
                return num;
            };

            self.convertToDate = function (timestamp) {
                return $filter('date')(timestamp);
            };

            return self;
        }]);
})();
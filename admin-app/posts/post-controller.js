(function() {
	'use strict';

	angular.module('app')
		.controller('PostCtrl', ['data', 'common', 'lookup', '$modal', 'UserService', 'notifications', function(data, common, lookup, $modal, UserService, notifications) {

			var postViewModel = this;

			// Binding the form
			postViewModel.form = null;
			/********************
			* Image Upload Modal
			*******************/
			postViewModel.openImageUploadModal = function () {

				var modalInstance = $modal.open({
					templateUrl: 'modals/modal-file-upload.html',
					controller: 'ModalFileUploadCtrl',
					controllerAs: 'modalVM',
					size: 'sm',
					resolve: {
						config: function () {
							return {
								title: 'Upload Image',
								buttonLabel: 'Select Image File',
								showDescriptionField: true
							};
						}
					}
				});

				modalInstance.result.then(function (data) {
					var image = '![' + data.description + '](' + data.url + ')';
					common.insertTextAtLastPos('Markdown', image);
				});
			};

			/*****************
			* Request Review Modal
			****************/
			postViewModel.openRequestReviewModal = function () {

				var modalInstance = $modal.open({
					templateUrl: 'modals/modal-request-review.html',
					controller: 'ModalRequestReviewCtrl',
					controllerAs: 'modalVM',
					size: 'md'
				});

				modalInstance.result.then(function (data) {
					var url = common.absUrl();
					var message = data.message + ' <br><br>';
					message = message + 'Link: <a href="' + url + '">' + url + '</a><br>';
					message = message + 'Author: ' + UserService.getUser().FullName + '<br>';
					message = message + 'Post Title: ' + postViewModel.post.Title;
					var saveRecordData = getSaveRecordData();
					saveRecordData.successMessage = 'Request Sent';
					saveRecordData.data.notify = message;
					common.saveRecord(saveRecordData);
				});
			};

			/*****************
			* Markdown Help Modal
			****************/
			postViewModel.openMarkdownHelpModal = function () {

				var modalInstance = $modal.open({
					templateUrl: 'modals/modal-general.html',
					controller: 'ModalGeneralCtrl',
					controllerAs: 'modalVM',
					size: 'lg',
					resolve: {
						data: ['$http', function ($http) {
							var data = {
								title: 'Markdown Help Guide'
							};
							return $http.get('/markdown-help.txt').then(function (file) {
								if(file) {
									data.body = marked(file.data);
								}
								return data;
							});
						}]
					}
				});
			};

			/*****************
			* Datepicker Controls
			****************/
			postViewModel.openDatepicker = function($event) {
				$event.preventDefault();
				$event.stopPropagation();

				postViewModel.datepickerOpened = true;
			};

			postViewModel.post = data ? data : {};

			postViewModel.isAdmin = function () {
				return UserService.IsAdmin();
			};

			// Who can edit this post?
			// If the user is admin.
			// If there is no data (new post)
			// If the user is the author of this post and it's not published
			postViewModel.canEdit = function () {
				return UserService.IsAdmin() || !data || (UserService.getUser().id === data.AuthorUserId && !data.PublishDate);
			};

			postViewModel.expand = function() {
				common.autoExpandTextarea('Markdown');
			};

			lookup.getAvailableTopics().then(function(res) {
				postViewModel.availableTopics = res;
				postViewModel.selectedTopics = [];
				if(data && data.Topics) {
					var topics = data.Topics.split(',');
					for(var i = 0; i < topics.length; i++) {
						// Because ngRepeat and ngOptions don't play well together
						// when using string data.
						postViewModel.selectedTopics.push({
							id: i,
							Name: topics[i]
						});
					}
				} else {
					postViewModel.selectedTopics.push({
						id: 0,
						Name: ''
					});
				}
				postViewModel.post.Topics = '';
			});

			lookup.getAvailableCategories().then(function(res) {
				postViewModel.availableCategories = res;
			});

			lookup.getAvailableUsers().then(function(res) {
				postViewModel.availableUsers = res;
				postViewModel.post.AuthorUserId = data && data.AuthorUserId ? data.AuthorUserId : UserService.UserId();
			});

			function getSelectedTopics() {
				// concat topics.
				var topics = [];
				for(var i = 0; i < postViewModel.selectedTopics.length; i++) {
					var topic = postViewModel.selectedTopics[i];
					if(topic.hasOwnProperty('Name') && topic.Name !== '') {
						topics.push(topic.Name);
					}
				}
				return topics.join();
			}

			function getSaveRecordData() {
				postViewModel.post.Topics = getSelectedTopics();
				var data = {
					post: postViewModel.post
				};
				data.post.PublishDate = postViewModel.post.PublishDate ? postViewModel.post.PublishDate : null;

				if (!Number(data.post.PublishDate) && data.post.PublishDate !== null) {
					data.post.PublishDate = data.post.PublishDate.getTime();
				}
				var saveRecordData = {
	                endpoint: 'posts',
	                method: 'post',
	                data: data,
	                id: postViewModel.post ? postViewModel.post.id : null,
	                successMessage: 'Created Post',
	                onSuccess: function () {
	                    common.goToUrl('/posts');
	                }
				};

				if (postViewModel.post.id) {
	                saveRecordData.method = 'put';
					saveRecordData.successMessage = 'Updated Post';
	            }
				return saveRecordData;
			}

			var toolbarButtons = {
				standardButtons: ['cancel'],
				customButtons: [
					{
						condition: function () {
							return (!postViewModel.post.PublishDate);
						},
						clickFn: postViewModel.openRequestReviewModal,
						btnClass: 'btn-info',
						btnGlyph: 'glyphicon-ok',
						btnText: 'Request Review'
					},
					{
						clickFn: function () {
							if (postViewModel.form.$valid) {
								postViewModel.form.$setSubmitted();
								var saveRecordData = getSaveRecordData();
								common.saveRecord(saveRecordData);
								console.log('saved');
							} else {
								postViewModel.form.$setSubmitted();
								notifications.showError('All fields are required');
							}
						},
						btnClass: 'btn-success',
						btnGlyph: 'glyphicon-save',
						btnText: 'Save'
					}
				]
			};

			if (postViewModel.canEdit()) {
				common.setupToolbarButtons(toolbarButtons);
				common.setCancel(function() {
					common.goToUrl('/posts');
				});
			}

		}]);
})();

angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("home/home.html","<h1>Dashboard</h1>\n");
$templateCache.put("login/login.html","<button class=\"btn btn-sm btn-primary\" ng-click=\"loginViewModel.authenticate(\'twitter\')\">Sign in with Twitter</button>\n");
$templateCache.put("navbar/navbar.html","<div class=\"navbar navbar-inverse navbar-static-top\" role=\"navigation\" ng-controller=\"NavCtrl as nav\">\n    <div class=\"container\">\n        <div class=\"navbar-header\">\n            <button type=\"button\" class=\"navbar-toggle\" ng-click=\"nav.isCollapsed = !nav.isCollapsed\">\n                <span class=\"sr-only\">Toggle navigation</span>\n                <span class=\"icon-bar\"></span>\n                <span class=\"icon-bar\"></span>\n                <span class=\"icon-bar\"></span>\n            </button>\n            <a class=\"navbar-brand\" href=\"#\" ng-bind=\"siteTitle\">...</a>\n        </div>\n        <div class=\"collapse navbar-collapse\" collapse=\"nav.isCollapsed\">\n            <ul class=\"nav navbar-nav\">\n                <li ng-class=\"{active:nav.isActive([\'posts\'])}\"><a ng-href=\"#/posts\">Posts</a></li>\n                <li ng-class=\"{active:nav.isActive([\'topics\'])}\"><a ng-href=\"#/topics\">Topics</a></li>\n            </ul>\n            <ul class=\"nav navbar-nav navbar-right\">\n                <li data-toggle=\"collapse\" data-target=\"#main-nav\" data-ng-class=\"{active:nav.isActive([\'profile\'])}\" ng-show=\"nav.userLogged()\"><a href=\"#/profile\"><span class=\"glyphicon glyphicon-cog\"></span></a></li>\n                <li data-toggle=\"collapse\" data-ng-class=\"{active:nav.isActive([\'login\'])}\"  data-target=\"#main-nav\" data-ng-show=\"!nav.userLogged()\"><a href=\"#/login\">Log In</a></li>\n                <li data-toggle=\"collapse\" data-target=\"#main-nav\" data-ng-show=\"nav.userLogged()\"><a href=\"#/logout\">Log Out</a></li>\n            </ul>\n        </div><!--/.nav-collapse -->\n    </div>\n    <ng-include src=\"nav.secondaryNav()\"></ng-include>\n</div>\n");
$templateCache.put("modals/modal-file-upload.html","<div class=\"modal-header\">\n	<h4 class=\"modal-title\">{{modalVM.title}}</h4>\n</div>\n<div class=\"modal-body\">\n	<button class=\"btn btn-primary btn-xs\" ng-file-select=\"modalVM.onFileSelect($files)\">{{modalVM.buttonLabel}}</button>\n</div>\n<div class=\"modal-footer\">\n	<button class=\"btn btn-warning btn-xs\" ng-click=\"modalVM.close()\">Close</button>\n</div>\n");
$templateCache.put("partials/clickable-row.html","<div ng-click=\"getExternalScopes().gridRowSelectAction(row)\" ng-repeat=\"col in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell selectable\" ui-grid-cell>\n\n</div>\n");
$templateCache.put("partials/toaster.html","<toaster-container></toaster-container>\n");
$templateCache.put("profile/profile.html","<div class=\"panel panel-default\">\n	<div class=\"panel-heading\">\n		<h3 class=\"panel-title\">Details</h3>\n	</div>\n	<div class=\"panel-body\">\n		<div class=\"row\">\n			<div class=\"col-sm-3 form-group\">\n				<label class=\"control-label\">User Name</label>\n				<input type=\"text\" class=\"form-control\" data-ng-model=\"profileViewModel.user.Username\" disabled />\n			</div>\n			<div class=\"col-sm-3 form-group\">\n				<label class=\"control-label\">Full Name</label>\n				<input type=\"text\" class=\"form-control\" data-ng-model=\"profileViewModel.user.FullName\" />\n			</div>\n			<div class=\"col-sm-3 form-group\">\n				<label class=\"control-label\">Twitter Handle</label>\n				<input type=\"text\" class=\"form-control\" data-ng-model=\"profileViewModel.user.TwitterHandle\" />\n			</div>\n			<div class=\"col-sm-3 form-group\">\n				<label class=\"control-label\">Created On</label>\n				<input type=\"text\" class=\"form-control\" data-ng-model=\"::profileViewModel.user.CreateDateDisplay\" disabled />\n			</div>\n			<div class=\"col-sm-6 form-group\">\n				<div ng-show=\"profileViewModel.user.ProfileUrl\">\n					<label class=\"conrol-label\">Profile Photo</label>\n					<div ng-show=\"profileViewModel.user.ProfileUrl\">\n						<img ng-src=\"{{profileViewModel.user.ProfileUrl}}\" />\n					</div>\n				</div>\n				<div>\n					<label class=\"control-label\">Profile Image URL</label>\n					<p class=\"input-group\">\n						<input type=\"text\" class=\"form-control\" data-ng-model=\"profileViewModel.user.ProfileUrl\" />\n						<span class=\"input-group-btn\">\n							<button class=\"btn btn-primary\" ng-file-select=\"profileViewModel.onFileSelect($files)\" name=\"image\">Upload Image</button>\n						</span>\n					</p>\n				</div>\n			</div>\n	</div>\n	</div>\n</div>\n");
$templateCache.put("posts/post-edit.html","<div class=\"row\">\n	<div class=\"col-sm-9\">\n		<div class=\"form-group\">\n			<label class=\"control-label\">Post Title</label>\n			<input class=\"form-control\" ng-model=\"postViewModel.post.Title\" placeholder=\"Post Title Goes Here...\" />\n		</div>\n		<tabset>\n			<tab select=\"postViewModel.expand(\'Markdown\')\">\n				<tab-heading>\n					Edit\n				</tab-heading>\n				<div>\n					<br />\n					<div class=\"form-group tools pull-right\">\n						<button class=\"btn btn-default btn-xs\" ng-click=\"postViewModel.openImageUploadModal()\" tooltip=\"Upload Image\"><span class=\"glyphicon glyphicon-picture\"></span></button>\n					</div>\n					<div class=\"form-group\">\n						<textarea class=\"form-control noresize\" rows=\"20\" placeholder=\"Your Story Goes Here... Make it good.\" ng-model=\"postViewModel.post.Markdown\" ng-keyup=\"postViewModel.expand($event)\" id=\"Markdown\"></textarea>\n					</div>\n				</div>\n			</tab>\n			<tab>\n				<tab-heading>\n					Preview\n				</tab-heading>\n				<br />\n				<div class=\"\" marked=\"postViewModel.post.Markdown\"></div>\n			</tab>\n		</tabset>\n	</div>\n	<div class=\"col-sm-3\">\n\n		<div class=\"sidebar\">\n\n			<div class=\"form-group\">\n				<label class=\"control-label\">Category</label>\n				<select class=\"form-control\" ng-model=\"postViewModel.post.Category\" ng-options=\"option as option for option in postViewModel.availableCategories\">\n					<option value=\"\">--Select One--</option>\n				</select>\n			</div>\n\n			<div class=\"form-group\">\n				<div>\n					<label class=\"control-label\">Topics</label>\n					<div class=\"pull-right\">\n						<button class=\"btn btn-default btn-xs\" ng-click=\"postViewModel.selectedTopics.push(\'\')\"><span class=\"glyphicon glyphicon-plus\"></span></button>\n					</div>\n				</div>\n				<div class=\"form-group\" ng-repeat=\"topic in postViewModel.selectedTopics\">\n					<select class=\"form-control\" ng-model=\"topic\" ng-options=\"option.Name as option.Name for option in postViewModel.availableTopics\">\n						<option value=\"\">--Select One--</option>\n					</select>\n				</div>\n			</div>\n\n			<div class=\"form-group\">\n				<label class=\"control-label\">Author</label>\n				<select class=\"form-control\" ng-model=\"postViewModel.post.AuthorUserId\" ng-options=\"option.id as option.FullName for option in postViewModel.availableUsers\">\n					<option value=\"form-control\">--Select One--</option>\n				</select>\n			</div>\n\n			<div class=\"form-group\">\n				<label class=\"control-label\">Excerpt</label>\n				<textarea class=\"form-control noresize\" rows=\"8\" ng-model=\"postViewModel.post.Abstract\"></textarea>\n			</div>\n\n		</div><!-- .sidebar -->\n\n	</div>\n</div><!-- .row -->\n");
$templateCache.put("posts/posts.html","<div class=\"datatable section\" ng-grid=\"postsViewModel.datatable\"></div>\n");
$templateCache.put("toolbar/toolbar.html","<div ng-controller=\"ToolbarCtrl as toolbar\" class=\"toolbar\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col-sm-4\">\n                <div class=\"pull-left\">\n                    <button class=\"btn btn-xs btn-default\" ng-click=\"toolbar.returnToList()\" ng-show=\"toolbar.returnButtonEnabled()\">\n                        <span class=\"glyphicon glyphicon-th-list\"></span>\n                    </button>\n                    &nbsp;\n                </div>\n                <h2 class=\"page-title\">\n                    {{ pageTitle }}\n                </h2>\n            </div>\n            <div class=\"col-sm-8\">\n\n                <div class=\"pull-right\">\n                    <span ng-repeat=\"button in toolbar.otherButtons()\">\n                        <button type=\"button\" class=\"btn btn-xs\" ng-class=\"button.btnClass\" ng-click=\"button.clickFn()\">\n                            <span class=\"glyphicon\" ng-class=\"button.btnGlyph\"></span> <span ng-bind=\"button.btnText\"></span>\n                        </button>\n                    </span>\n                    <button type=\"button\" class=\"btn btn-xs btn-primary\" ng-click=\"toolbar.addItem()\" ng-show=\"toolbar.addButtonEnabled()\">\n                        <span class=\"glyphicon glyphicon-plus\"></span>\n                    </button>\n                    <button type=\"button\" class=\"btn btn-xs btn-primary\" ng-click=\"toolbar.editItem()\" ng-show=\"toolbar.editButtonEnabled()\">\n                        <span class=\"glyphicon glyphicon-pencil\"></span>\n                    </button>\n                    <button type=\"button\" class=\"btn btn-success btn-xs\" ng-click=\"toolbar.saveRecord()\" ng-show=\"toolbar.saveButtonEnabled()\">\n                        <span class=\"glyphicon glyphicon-save\"></span> Save\n                    </button>\n                    <button type=\"button\" class=\"btn btn-warning btn-xs\" ng-click=\"toolbar.cancel()\" ng-show=\"toolbar.cancelButtonEnabled()\">\n                        <span class=\"glyphicon glyphicon-remove\"></span> Cancel\n                    </button>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n");}]);
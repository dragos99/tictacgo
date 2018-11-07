'use strict';

function TabView(parent, tab, tabLinksParent, action){
	this.activeTab = tab;
	this.tabLinks = [];
	this.tabLinksParent = document.querySelector(tabLinksParent);
	this.sliding = false;
	this.action = action;

	this.init = function(){
		this.tabs = document.querySelectorAll(parent + ' > .tab');
		var tab, tabLink;

		for(var i = 0; tab = this.tabs[i]; ++i){
			var dif = i - this.activeTab;
			var left = dif * 100;
			tab.style.left = left + '%';
			tab.left = left + '%';

			var tabLinksParent = this.tabLinksParent || tab;
			var tabLinks = tabLinksParent.querySelectorAll('.tab-link');
			for(var j = 0; tabLink = tabLinks[j]; ++j){
				tabLink.addEventListener('click', this.navigate.bind(this, tabLink.getAttribute('data-href')));
				this.tabLinks.push(tabLink);
			}
		}

		//window.addEventListener('wheel', this.onWheel.bind(this));
	}

	this.navigate = function(tab){
		var dif = this.activeTab - tab;
		this.activeTab = tab;
		var left = dif * 100;
		for(var i = 0;  tab = this.tabs[i]; ++i){
			tab.left = parseInt(tab.left) + left + '%';
			tab.style.left = tab.left;
		}

		setTimeout(this.action.bind(this), 0);
	}

	/*this.onWheel = function(e){
		if(this.sliding)
			return;

		this.sliding = true;
		var _this = this;
		setTimeout(function() {
			_this.sliding = false;
		}, 500);

		var index = this.activeTab;

		if(e.deltaY > 0){
			if(index < this.tabs.length - 1) {
				index++;
			}

		} else {
			if(index > 0) 
				index--;
		}

		this.navigate(index);
	}*/
}
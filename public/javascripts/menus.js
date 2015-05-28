function setup() {
	var activeClassName = "active";
	var menuItems = $("ul.nav li");
	var sections = [];
	var navbarHeight = $(".navbar").innerHeight();
	
	// For each menu item, add it's corresponding section header 
	menuItems.each(function (index, element) {
		element = $(element);
		
		var sectionName = element.attr("class");
		
		sections.push($(".section." + sectionName));
	});

	function updateMenuItems() {
		var scrollTop = $(window).scrollTop() + navbarHeight;
		var hasReachedBottom = (window.innerHeight + scrollTop) >= document.body.offsetHeight;

		for (var index = 0; index < sections.length; index++) {
			var menuItem = $(menuItems[index]);
			var section = sections[index].removeClass(activeClassName);
			var isFirstSection = index == 0;
			var isLastSection = index == sections.length - 1;
			var menuItemHasClass = menuItem.hasClass(activeClassName);
			
			if (hasReachedBottom) {
				if (isLastSection && !menuItemHasClass) {
					menuItem.addClass(activeClassName);
				}
				else if (!isLastSection && menuItemHasClass) {
					menuItem.removeClass(activeClassName);
				}
			}
			else {
				var sectionTop = section.position().top;
				var sectionBottom = sectionTop + section.outerHeight();
				var isInSection = (scrollTop >= sectionTop && scrollTop < sectionBottom) || (isFirstSection && scrollTop < sectionTop);

				if (isInSection && !menuItemHasClass) {
					menuItem.addClass(activeClassName);
				}
				else if (!isInSection && menuItemHasClass) {
					menuItem.removeClass(activeClassName);
				}
			}
		}
	}
	
	$(window).resize(updateMenuItems);

	$(window).scroll(updateMenuItems);

	updateMenuItems();
}

$(setup);
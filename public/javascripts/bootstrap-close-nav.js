$(function () {
	var navMain = $(".navbar");
	
	navMain.on("click", "a", null, function () {
		navMain.collapse('hide');
	});
});
function disableBtnStatus(status) {
	let small_wrong_links = document.querySelectorAll(".wrong-button");
	for (let i = 0; i < small_wrong_links.length; i++) {
		small_wrong_links[i].disabled = status;
	}
	let small_test_links = document.querySelectorAll(".test-button");
	for (let i = 0; i < small_test_links.length; i++) {
		small_test_links[i].disabled = status;
	}
}

export default disableBtnStatus;

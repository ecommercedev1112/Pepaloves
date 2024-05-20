theme.Giftcard = (function() {
	function printContent(el){
		var restorepage = document.querySelector('body').innerHTML;
		const printcontent = document.querySelector('#' + el).cloneNode(true);

		document.querySelector('body').innerHTML = '';
		document.querySelector('body').appendChild(printcontent);

		window.print();

		document.querySelector('body').innerHTML = restorepage;
	}
})();

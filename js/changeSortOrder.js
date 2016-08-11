function changeSortOrder(ctl) {
	//I have to do 2 things:
	//1) change the arrow to point the opposite direction.
	//2) change the name of the div itself, so I know what direction they want.
	
	var parentDiv = $(ctl).parent();
	var parentDivNameOld = parentDiv.attr("id");
	var colName;
	var parentDivNameNew;
	var oldDirection;
	var newDirection;
	
	if (parentDivNameOld.indexOf('_DirAsc') !== -1) {
		oldDirection = 'Asc';
		newDirection = 'Desc';
	}
	else {
		oldDirection = 'Desc';
		newDirection = 'Asc';
	}
	
	parentDivNameNew = parentDivNameOld.replace('_Dir' + oldDirection, '_Dir' + newDirection);	
	colName = parentDivNameNew.replace('_Dir' + newDirection, '');
	
	$("#sortColumns")[0].selectize.updateOption(parentDivNameOld, {myKey: parentDivNameNew, myVal: colName});
	$("#sortColumns")[0].selectize.refreshItems();
}
/// <reference path="../../typings/jquery/jquery.d.ts"/>
//Userlist data array for filling in info box
var userListData = [];

// DOM Ready =================================================================================================
$(document).ready(function() {
	
	populateTable();
	
});

// Functions ==================================================================================================

// Fill Table with Data
function populateTable() {
	
	//Empty content strung
	var tableContent = '';
	
	// jQuery AJAX call for JSOn
	$.getJSON( '/users/userlist', function( data ) {
		
		//For each item in JSON, add a table row and cells to the content string
		$.each(data, function() {
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
			tableContent += '</tr>';
		});
		
		//Inject the whole content string into our existing html table
		$('#userList table tbody').html(tableContent);
	});
}
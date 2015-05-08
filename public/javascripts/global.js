/// <reference path="../../typings/jquery/jquery.d.ts"/>
//Userlist data array for filling in info box
var userListData = [];

// DOM Ready =================================================================================================
$(document).ready(function() {
	
	populateTable();
	
	// Username link click
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
	
});

// Functions ==================================================================================================

// Fill Table with Data
function populateTable() {
	
	//Empty content strung
	var tableContent = '';
	
	// jQuery AJAX call for JSOn
	$.getJSON( '/users/userlist', function( data ) {
		
		//Stick our user data array into a userlist variable in the global object
		userListData = data;
		
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

// Show User Info
function showUserInfo(event) {
	
	// Prevent Link from Firing
	event.preventDefault();
	
	// Retrieve username from link rel attribute
	var thisUserName = $(this).attr('rel');
	
	// Get Index of object based on id value
	var arrayPosition = userListData.map(function(arrayItem){
		return arrayItem.username;
	}).indexOf(thisUserName);
	
	// Get our User object
	var thisUserObject = userListData[arrayPosition];
	
	//Populate Info Box
	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);
	
	
}
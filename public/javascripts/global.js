/// <reference path="../../typings/jquery/jquery.d.ts"/>
//Userlist data array for filling in info box
var userListData = [];

// DOM Ready =================================================================================================
$(document).ready(function() {
	
	populateTable();
	
	// Username link click
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
	
	// Add User button click
	$('#addUser fieldset').on('click', '#btnAddUser', addUser);
	
	// Delete User link click
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
	
	// Edit User Link click
	$('#userList table tbody').on('click', 'td a.linkedituser', editUser);
	
	// Submit User Edit
	$('#addUser fieldset').on('click', '#btnEditUser', submitEdit);
	
	// Cancel User Edit
	$('#addUser fieldset').on('click', '#btnCancelEdit', cancelEdit);
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
			tableContent += '<td><a href="#" class="linkedituser" rel="' + this._id + '">edit</a></td>';
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

// Add User
function addUser(event) {
	event.preventDefault();
	
	// Super basic validation- increases errorCount variable if any fields are blank
	var errorCount = 0;
	$('#addUser input').each(function(index, val) {
		if($(this).val() === '') { errorCount++; }
	});
	
	// Check if errorCount is still at zero
	if(errorCount === 0) {
		
		//Compile all user info into one object
		var newUser = {
			'username' : $('#addUser fieldset input#inputUserName').val(),
			'email' : $('#addUser fieldset input#inputUserEmail').val(),
			'fullname' : $('#addUser fieldset input#inputUserFullname').val(),
			'age' : $('#addUser fieldset input#inputUserAge').val(),
			'location' : $('#addUser fieldset input#inputUserLocation').val(),
			'gender' : $('#addUser fieldset input#inputUserGender').val(),
		};
		
		// Use AJAX to post the object to our adduser service
		$.ajax({
			type : 'POST',
			data : newUser,
			url : '/users/adduser',
			dataType : 'JSON'
		}).done(function( response ) {
			
			// Check for successful (blank) response
			if (response.msg === '') {
				
				// Clear the form inputs
				$('#addUser fieldset input').val('');
				
				// Update the table
				populateTable();
			}
			else {
				
				// IF something goes wrong, alert the error message that our service returned
				alert('Error: ' + response.msg);
				
			}
		});
	}
	else {
		// If errorCount is more than 0, error out
		alert('Please fill in all fields');
		return false;
	}
};

// Delete User
function deleteUser(event) {
	
	event.preventDefault();
	
	// Pop up a confirmation Dialog
	var confirmation = confirm('Are you sure you want to delete this user?');
	
	//Check if user confirmed
	if (confirmation === true) {
		
		// Delete User
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function( response ) {
			
			//check for successful response
			if (response.msg === '') {
			} else {
				alert('Error: ' + response.msg);
			}
			
			// Update the table
			populateTable();
		});
	} else {
		
		// If they aid no to the confirm, do nothing
		return false;
	}
};

//Edit User
function editUser(event) {
	
	event.preventDefault();
	
	//get User Info
	var thisUserId = $(this).attr('rel');
	var arrayPosition = userListData.map(function(arrayItem){
		return arrayItem._id;
	}).indexOf(thisUserId);
	var thisUser = userListData[arrayPosition];
	
	//Populate form
	$('#inputUserName').val(thisUser['username']);
	$('#inputUserEmail').val(thisUser['email']);
	$('#inputUserFullname').val(thisUser['fullname']);
	$('#inputUserAge').val(thisUser['age']);
	$('#inputUserLocation').val(thisUser['location']);
	$('#inputUserGender').val(thisUser['gender']);
	
	//Swap Buttons
	if ($('#btnAddUser').length) {
		var submitButtons = '<button id="btnCancelEdit">Cancel</button><button id="btnEditUser">Submit</button>';
		$('#addUser fieldset').append(submitButtons);
		$('#btnEditUser').data({'id' : thisUserId});
		$('#btnAddUser').remove();
	} else {
		$('#btnEditUser').data({'id' : thisUserId});
	};

	
	//Rename form
	$('h2:contains("Add User")').html('Edit User');
};

//Cancel Edit
function cancelEdit(event) {
	console.log('hey!');
	//clear form
	$('#addUser fieldset input').val('');
	
	//Switch buttons back
	$('#btnCancelEdit').remove();
	$('#btnEditUser').remove();
	$('#addUser fieldset').append('<button id="btnAddUser">Add User</button>');
	
	//change form title back
	$('h2:contains("Edit User")').html('Add User');
};

//Submit Edit
function submitEdit(event) {
	var userToEdit= $('#btnEditUser').data("id");
	
	var errorCount = 0;
	$('#addUser input').each(function(index, val) {
		if($(this).val() === '') { errorCount++; }
	});
	
	// Check if errorCount is still at zero
	if(errorCount === 0) {
		
		//Compile all user info into one object
		var userUpdate = {
			'username' : $('#addUser fieldset input#inputUserName').val(),
			'email' : $('#addUser fieldset input#inputUserEmail').val(),
			'fullname' : $('#addUser fieldset input#inputUserFullname').val(),
			'age' : $('#addUser fieldset input#inputUserAge').val(),
			'location' : $('#addUser fieldset input#inputUserLocation').val(),
			'gender' : $('#addUser fieldset input#inputUserGender').val(),
		};
		
		// Use AJAX to post the object to our adduser service
		$.ajax({
			type : 'PUT',
			data : userUpdate,
			url : '/users/edituser/' + userToEdit,
			dataType : 'JSON'
		}).done(function( response ) {
			
			// Check for successful (blank) response
			if (response.msg === '') {
				
				// Clear the form inputs
				cancelEdit();
				
				// Update the table
				populateTable();
			}
			else {
				
				// IF something goes wrong, alert the error message that our service returned
				alert('Error: ' + response.msg);
				
			}
		});
	}
	else {
		// If errorCount is more than 0, error out
		alert('Please fill in all fields');
		return false;
	};
	
};
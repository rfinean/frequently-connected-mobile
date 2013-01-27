function validateEmail(email)
{
	var pattern = /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-\+]+)*@[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-\+]+)*(\.[A-Za-z]{2,})$/;

	return pattern.test(email);
}

function validatePhoneNumber(phoneNumber)
{
	var pattern = /^([0{1}]|4{2})[0-9]{10}$/;

	return pattern.test(phoneNumber);
}

function validateNhsNumber(nhsNumber, url)
{
	res = false;
	$.ajax({
		url: 		url + '/components/methods/validation/nhsNumber.jsp?nhsNumber=' + nhsNumber,
		async : 	false,
		success : 	function(data){
						res = data.result;
					},
		dataType :	'json'
	});
	return res;

}

function validateFieldPhoneNo(fieldStr)
{
	var num = $('#' + fieldStr).val();
	var valid = validatePhoneNumber(num);
	//console.log(num);
	//console.log(valid);
	if(num != '' && valid)
	{
		$('#' + fieldStr + 'ToC').tick();
	}
	else if(num != '' && !valid)
	{
		$('#' + fieldStr + 'ToC').cross();
	}
	else
	{
		$('#' + fieldStr + 'ToC').neither();
	}	
	
}

function validateFieldEmail(fieldStr)
{
	var num = $('#' + fieldStr).val();
	var valid = validateEmail(num);
	if(num != '' && valid)
	{
		$('#' + fieldStr + 'ToC').tick();
	}
	else if(num != '' && !valid)
	{
		$('#' + fieldStr + 'ToC').cross();
	}
	else
	{
		$('#' + fieldStr + 'ToC').neither();
	}	
	
}

function validateFieldNHSNumber(fieldStr,url)
{
	var num = $('#' + fieldStr).val();
	var valid = validateNhsNumber(num,url);
	if(num != '' && valid)
	{
		$('#' + fieldStr + 'ToC').tick();
	}
	else if(num != '' && !valid)
	{
		$('#' + fieldStr + 'ToC').cross();
	}
	else
	{
		$('#' + fieldStr + 'ToC').neither();
	}	
	
}

function existingEmailAddress(email,url, contactID)
{
	res = false;
	var data = { emailAddress : email };
	if(contactID != null)
	{
		data.contactID = contactID;
	}
	$.ajax({
		url: 		url + '/components/methods/validation/existingEmailAddress.jsp',
		data: 		data,
		async : 	false,
		success : 	function(data){
						res = data.result;
					},
		dataType :	'json'
	});
	return res;

}

function existingPhoneNumber(phoneNumber,url,contactID)
{
	res = false;
	var data = { phoneNumber : phoneNumber };
	if(contactID != null)
	{
		data.contactID = contactID;
	}
	$.ajax({
		url: 		url + '/components/methods/validation/existingPhoneNumber.jsp',
		data: 		data,
		async : 	false,
		success : 	function(data){
						res = data.result;
					},
		dataType :	'json'
	});
	return res;

}

function existingNhsNumber(nhsNumber,url)
{
	res = false;
	var data = { nhsNumber : nhsNumber };
	if(typeof contactID != 'undefined')
	{
		data.contactID = contactID;
	}

	$.ajax({
		url: 		url + '/components/methods/validation/existingNHSNumber.jsp',
		data: 		data,
		async : 	false,
		success : 	function(data){
						res = data.result;
					},
		dataType :	'json'
	});
	return res;

}



function showTooltip(x, y, contents) {
	$('<div id="tooltip" style="z-index: 999">' + contents + '</div>').css( {
	    position: 'absolute',
	    'font-size': '0.8em',
	    display: 'none',
	    top: y + 8,
	    left: x + 8,
	    border: '1px solid #000',
	    padding: '2px',
	    'background-color': '#fff',
	    opacity: '0.8'
	}).appendTo("body").fadeIn(400);
    
}


//Prepare to show a date picker linked to three select controls
function readSelectedDate(id) {
	
	var year = parseInt($('#' + id + 'Year').val());
	var month = parseInt($('#' + id + 'Month').val());
	if(month < 10)
	{
		month = '0' + month;
	}
	var date = parseInt($('#' + id + 'Date').val());
	if(date < 10)
	{
		date = '0' + date;
	}
	return new Date(year,month,date);
}

$.fn.reset = function() {
  return this.each(function() {
    var type = this.type, tag = this.tagName.toLowerCase();
    if (tag == 'form')
      return $(':input',this).reset();
    if (type == 'text' || type == 'password' || tag == 'textarea')
      this.value = '';
    else if (type == 'checkbox' || type == 'radio')
      this.checked = false;
    else if (tag == 'select')
      this.selectedIndex = -1;
  });
};



	
	

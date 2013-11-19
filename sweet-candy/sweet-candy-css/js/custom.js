jQuery(document).ready(function(){
	tfuse_custom_form();
});

function tfuse_custom_form(){
	var my_error;
	var url = jQuery("input[name=temp_url]").attr('value');
	jQuery("#send").bind("click", function(){

	my_error = false;
	jQuery("#commentForm input,#commentForm textarea,#commentForm select").each(function(i)
	{
				var surrounding_element = jQuery(this);
				var value 				= jQuery(this).val();
				var check_for 			= jQuery(this).attr("id");
				var required 			= jQuery(this).hasClass("required");

				if(check_for == "email"){
					surrounding_element.removeClass("error valid");
					baseclases = surrounding_element.attr("class");
					if(!value.match(/^\w[\w|\.|\-]+@\w[\w|\.|\-]+\.[a-zA-Z]{2,4}$/)){
						surrounding_element.attr("class",baseclases).addClass("error");
						my_error = true;
					}else{
						surrounding_element.attr("class",baseclases).addClass("valid");
					}
				}

				if(check_for == "message"){
					surrounding_element.removeClass("error valid");
					baseclases = surrounding_element.attr("class");
					if(value == "" || value == "Hi how are you?"){
						surrounding_element.attr("class",baseclases).addClass("error");
						my_error = true;
					}else{
						surrounding_element.attr("class",baseclases).addClass("valid");
					}
				}

				if(required && check_for != "email" && check_for != "message"){
					surrounding_element.removeClass("error valid");
					baseclases = surrounding_element.attr("class");
					if(value == ""){
						surrounding_element.attr("class",baseclases).addClass("error");
						my_error = true;
					}else{
						surrounding_element.attr("class",baseclases).addClass("valid");
					}
				}


			   if(jQuery("#commentForm input,#commentForm textarea,#commentForm select").length  == i+1){
					if(my_error == false){
						document.commentForm.submit();
                        /*
                        jQuery(".ajax_form").slideUp(400);

						var $datastring = "ajax=true";
						jQuery(".ajax_form input, .ajax_form select").each(function(i)
						{
							var $name = jQuery(this).attr('name');
							var $value = encodeURIComponent(jQuery(this).attr('value'));
							$datastring = $datastring + "&" + $name + "=" + $value;
						});


						jQuery(".ajax_form #send").fadeOut(100);

						jQuery.ajax({
						   type: "POST",
						   url: "./sendmail.php",
						   data: $datastring,
						   success: function(response){
						   jQuery(".ajax_form").before("<div class='ajaxresponse' style='display: none;'></div>");
						   jQuery(".ajaxresponse").html(response).slideDown(400);
						   jQuery(".ajax_form #send").fadeIn(400);
						   jQuery(".ajax_form input, .ajax_form textarea, .ajax_form radio, .ajax_form select").val("");
							   }
							});
						*/
						}
				}

			});
			return false;
	});
}

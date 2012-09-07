$(document).ready(function() {

	 $.each($("[required]"), function (index, element) {
	 //esto se debe a los combobox
	 	var asterisco = '<a href="#" id="required'+ $(element).attr("id")+'" class="requerido" title="Campo Requerido" tabIndex=-1>*</a>'
		if (!$(element).data().combobox){
		if ($(element).prev().data().combobox){

			if($(element).next().next().html() !=$(asterisco).html()){		
			$(asterisco).insertAfter($(element).next());
			}
		}else{
			if($(element).next().html() != $(asterisco).html()){
				$(asterisco).insertAfter(element);}
			}
		}
		$(element).blur(function(){
		if($(element).val() != "" && $(element).attr("required") != $(element).val() ){
				$("#required"+ $(element).attr("id") ).hide();
			}else{
				$("#required"+ $(element).attr("id") ).show();
			}
		});
		
	 })




    // get the form and its input elements
    var form = document.forms[0],
        inputs = form.elements;
    // if no autofocus, put the focus in the first field
    if (!Modernizr.input.autofocus) {
        inputs[0].focus();
    }
    if(!Modernizr.inputtypes.number){
		 $('input[type=number]').typeNumber();
	
    }
    //placeholder
    if (!Modernizr.input.placeholder) {
        // input.placeholder{ color: #cccccc;}

        $('input[placeholder]').placeholder();
    }
    // if required not supported, emulate it
    if (!Modernizr.input.required) {
        form.onsubmit = function () {
            var required = [], att, val;
            // loop through input elements looking for required
            for (var i = 0; i < inputs.length; i++) {
                att = inputs[i].getAttribute('required');
                // if required, get the value and trim whitespace
                if (att != null) {
                    val = inputs[i].value;
                    placeholder = inputs[i].getAttribute('placeholder');
                    if (placeholder != null) {
                        if (val == placeholder) {
                         $(inputs[i]).addClass("ui-state-error");
                            required.push(inputs[i].name);
                        } else {
                            $(inputs[i]).removeClass("ui-state-error");
                        } 
                        
                    } else {
                        // if the value is empty, add to required array
                        if (val.replace(/^\s+|\s+$/g, '') == '') {
                            $(inputs[i]).addClass("ui-state-error");
                            required.push(inputs[i].name);
                        } else {
                            $(inputs[i]).removeClass("ui-state-error");
                        } 
                    }
                }
            }
            // show alert if required array contains any elements
            if (required.length > 0) {
                alert('Complete los campos Requeridos!:');
                // prevent the form from being submitted

                return false;
            }
        };
    }
});

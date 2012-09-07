lang={
    'ERROR_LEN':'La logitud es inferior a la esperada',
    'ERROR_NUMER': 'El valor ingresado no es del tipo Numerico',
    'ERROR_TEXT': 'El valor ingresado no es del tipo Texto permitido',
    'NO_MATCH':'Las contraseñas no coinciden'

}


    
var msgId = 0;
titulo = 'ui-dialog-title-'

//esa es la clase padre de las utilidades.
util = {
	finSession:function(){
		$.ajax({
			url: "../WebService/LiquidacionWS.aspx/",
			dataType: "json",
			type: "POST",
				data: {
						metodo: "finSession"
				},
				success: function (data) {
					document.location.href = "../LoginCliente.aspx"						
				}
			});
	},
    validaError:function(data){
        if (!data || !data.isError ){
            return false
            };
	_errores={
        M101:function(){
        	util.msg(data.msg,"Error","I",util.finSession);
        	session = null;
            return true;
        }
    }	
        _errores[data.numero]()		
    },
    validaRut:function(pRut){
        if (!pRut || pRut==""){
            return false
            }
        _Rut = pRut.split("-")
        if (_Rut.length == 1 && _Rut.length > 2 ){
            return false
            }
        _rut = _Rut[0].replace(/\./gi,"");
        _dv = _Rut[1];	 
        if(!'123456789K0'.indexOf(_dv.toString().toUpperCase())==-1){
            return false
            };
        var factor = 1, resto = 0, suma = 0;
        for( i =_rut.length; i >0 ; i--){
            factor++
            suma = suma + factor * parseInt(_rut.substring(i,i-1))
            if(factor == 7){
                factor = 1
                }
        }
        resto = 11 - suma % 11
        return  (('123456789K0'.substring(resto, resto -1).toUpperCase() == _dv.toUpperCase())?true:false)



		
    },
    isNull : function(value){
        return ((value==null|| value == "" || value == undefined)?0:value)
    },
    msg :function(mensaje,tit,tipo,aceptar,cancelar){
        msgId++ ;
        var msgIcon='';
        var msgIconColor='';
        var resultado = true;
        if(tipo == undefined){
            tipo = '';
        }
        if (tipo.toUpperCase() == 'ERROR' || tipo.toUpperCase() == 'X'){
            msgIcon = 'X';
            msgIconColor='red';
            resultado = false;
        }else if (tipo.toUpperCase() == 'INFORMATION' || tipo.toUpperCase() == 'I'){
            msgIcon = 'i';
            msgIconColor='blue';
            resultado = true;
        }else if (tipo.toUpperCase() == 'QUESTION' || tipo.toUpperCase() == '?'){
            msgIcon = '?';
            msgIconColor='black';
            resultado = true;
        }else if (tipo.toUpperCase() == 'WARNING' || tipo.toUpperCase() == 'EXCLAMATION' || tipo.toUpperCase() == '!'){
            msgIcon = '!';
            msgIconColor='orange';
            resultado = false;
        }

        html = ('<div id="Msg' + msgId + '">'+
            '<form><table cellSpacing="0" cellpadding="0">'+
            '<tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td id="Msg_icon"' + msgId + '><font color=' + msgIconColor + ' size="18"><b>&nbsp;'+ msgIcon +'&nbsp;</b></font></td><td style="vertical-align: middle;"><div id="Msg_content' + msgId + '">'+
            '</div>'+
            '</td></tr></table></form>'+
            '</div>')
        $("body").append(html);

        if (aceptar == undefined){
            botones={
                'Aceptar': function() {
                    util.closeMsg("#Msg" + msgId);
                }
                        
            }
        }
        if (aceptar != undefined && cancelar === undefined){
            botones={
                'Aceptar': function() {
                    
                    util.closeMsg("#Msg" + msgId);
            		eval(aceptar());
                }
            }
        }
        if (aceptar != undefined && cancelar != undefined){
            botones={
                'Aceptar': function() {

                     util.closeMsg("#Msg" + msgId);
           			 aceptar();
                },
                'Cancelar': function() {

                    util.closeMsg("#Msg" + msgId);
                    cancelar();
                }
            }
        }
        var p_ancho='auto'  
        if (mensaje.length < 35){
            p_ancho = 300;
        }
        var result = false;
        $("#Msg"+ msgId ).dialog({
            closeOnEscape:false,
            autoOpen: false,
            height: 'auto',
            width: p_ancho,
            modal: true,
            beforeclose: function(){
                return false
            },
            buttons: botones
        });

        $("#Msg_content"+ msgId ).empty();
        $("#Msg_content"+ msgId ).append(mensaje);
        $( "#Msg"+ msgId  ).dialog( "open" );
                    
        $("#" + titulo + "Msg" + msgId  ).empty();
        $("#" + titulo + "Msg" + msgId ).append(tit);
        $("#Aceptar").click(function(){
		
           
        });
        $("#Cancelar").click(function(){
          
            util.closeMsg("#Msg" + msgId);
            eval(cancelar);
        })
        if (tipo){
            return resultado
            }
        
    },
    closeMsg : function(ID){
        $( ID ).dialog( "close" );
        $(ID).remove();
        msgId--;
    },

   
    getAccordion:function(titulo,contenido,padre,id){
        return '<h3><a href="#">'+ titulo +'</a></h3>' +
        '<div id="' + padre + id + '">' +
        contenido +
        '</div>'
    },
    //Entrega la hora del sistema en formato local.
    addDays:function(days){
        if (!days){
            return new Date();   
        }else{
        var today = new Date();
        return util.getDate( new Date(today.getTime() + (days * 24 * 3600 * 1000)))
    }
    },
    getDate: function (_date) {
  
        var momentoActual;
        var day ;
        var month; 
        var year;
        if (!_date){
         momentoActual = new Date();
        
    }else
         momentoActual = new Date(_date);
    {
        day = momentoActual.getDate()
         month = momentoActual.getMonth() + 1
         year = momentoActual.getFullYear()

    }
        return ((day.toString().length == 1) ? '0' : '') + day.toString() + "/" + ((month.toString().length == 1) ? '0' : '') + month.toString() + "/" + year.toString()

    },
    //entrega el hh:mm:ss
    getTime: function () {
        var momentoActual = new Date();
        var hora = momentoActual.getHours();
        var minuto = momentoActual.getMinutes();
        var segundo = momentoActual.getSeconds();
        return hora + ":" + minuto + ":" + segundo;
    },
    //crea una cookie en la pagina que persiste aunque cierres el navegador
    cookies: {
        init: function () {

            var allCookies = document.cookie.split('; ');
            for (var i = 0; i < allCookies.length; i++) {
                var cookiePair = allCookies[i].split('=');
                this[cookiePair[0]] = cookiePair[1];
            }
        },
        create: function (name, value, days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
            }
            else var expires = "";
            document.cookie = name + "=" + value + expires + "; path=/";
            this[name] = value;
        },
        erase: function (name) {

            this.create(name, '', -1);
            this[name] = undefined;
        }
    },
    //objeto con la clase ui-clock le imprime cada 1 segundo la hora actual
    mueveReloj: function () {
        var momentoActual = new Date()
        var hora = momentoActual.getHours()
        var minuto = momentoActual.getMinutes()
        var segundo = momentoActual.getSeconds()
        var horaImprimible = hora + ":" + minuto + ":" + segundo
        $('.ui-clock').empty();
        $('.ui-clock').append(horaImprimible);
        setTimeout("util.mueveReloj()", 1000)
    },
    //obtiene el valor de un conjunto de radiobutons para saber cual se selecciono
    getRadioValue: function (ctrl) {
        for (i = 0; i < ctrl.length; i++)
            if (ctrl[i].checked) return ctrl[i].value;
    },
    //encriptacion de bajo niverl solo cambia los ascci 3 caracteres hacia adelant el codigo lo hice lo menos entenible posible ante hakeos
    crypt: function (m) {var d = '';for (xyz = 0; xyz < m.length; xyz++) {d = d + String.fromCharCode(m.substring(xyz, xyz + 1).charCodeAt(0) + 3);}return d },
    //ete lo tenemos que potenciar pero en realidad lo que hace es validar que los campos esten correctamente ingresados no esten vavios
    // si es numerico que tenga solo numeros y si es texto que no tenga caracteres raros.
    isValid: function (p_str_Cont) {

        var p_str_Control = '#' + p_str_Cont;

        var num = '1234567890.,';
        var abc = ' abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ_-1234567890.,´áéíóú�?É�?ÓÚ@üÜ"';

        var v_str_valor = $(p_str_Control).val();
        var obje = $(p_str_Control)
        if (v_str_valor.length == 0 && $(p_str_Control).hasClass('ui-obligatorio')) {
            $(p_str_Control).addClass('ui-state-error');
            
            // $('#Error_' + p_str_Cont).remove();
            // $(p_str_Control).parent().append('<div id="Error_' + p_str_Cont + '"style="font-size: 75%;">' + lang.ERROR_LEN + '</div> ')
            return false;
        } else {
            if ($(p_str_Control).hasClass('number')) {
                for (i = 0; i < v_str_valor.length; i++) {
                    if (num.indexOf(v_str_valor.substring(i, i + 1)) == -1) {
                        $(p_str_Control).addClass('ui-state-error');
                        //$('#Error_' + p_str_Cont).remove();
                        //$(p_str_Control).parent().append('<div id="Error_' + p_str_Cont + '" style="font-size: 75%;">' + lang.ERROR_NUMER + '</div> ')
                        return false;

                    }
                }
            } else if (($(p_str_Control).attr('type') == 'text' || $(p_str_Control).attr('type') == 'password') && !$(p_str_Control).hasClass('date')) {
                for (i = 0; i < v_str_valor.length; i++) {
                    if (abc.indexOf(v_str_valor.substring(i, i + 1)) == -1) {
                        $(p_str_Control).addClass('ui-state-error');
                        //$('#Error_' + p_str_Cont).remove();
                        //$(p_str_Control).parent().append('<div id="Error_' + p_str_Cont + '" style="font-size: 75%;">' + lang.ERROR_TEXT + '</div> ')
                        return false;

                    }
                }
            }else if ( $(p_str_Control)[0].type == 'select') {
                if($(p_str_Control).val() == "" || $(p_str_Control).val() == null ){
                    $(p_str_Control).addClass('ui-state-error');
                    //$('#Error_' + p_str_Cont).remove();
                    //$(p_str_Control).parent().append('<div id="Error_' + p_str_Cont + '" style="font-size: 75%;">' + lang.ERROR_TEXT + '</div> ')
                    return false;
                }
            }else if ($(p_str_Control).hasClass('date')) {
                var RegExPattern = /[0-9]{2}\/[0-9]{2}[0-9]{2}\/[0-9]{4}/;  
                    
                if ($(p_str_Control).val().match(RegExPattern) ) {  
                    $(p_str_Control).addClass('ui-state-error');
                    //$('#Error_' + p_str_Cont).remove();
                    //$(p_str_Control).parent().append('<div id="Error_' + p_str_Cont + '" style="font-size: 75%;">' + lang.ERROR_TEXT + '</div> ')
                    return false;
                }
            }

            $(p_str_Control).removeClass('ui-state-error');
            //$('#Error_' + p_str_Cont).remove();
            return true;
        }
    },
    //verifica que las passwords coincidan 
    passMatch: function (p_str_pass, p_str_confirm) {

        var v_str_pass = '#' + p_str_pass;
        var v_str_confirm = '#' + p_str_confirm;
        if ($(v_str_pass).val() == $(v_str_confirm).val()) {
            $(v_str_confirm).removeClass('ui-state-error');
            $(v_str_confirm).addClass('ui-state-highlight');
            $(' #Error_' + p_str_confirm).remove();
            return true;
        } else
            $(v_str_confirm).removeClass('ui-state-highlight');
        $(v_str_confirm).addClass('ui-state-error');
        $('#Error_' + p_str_confirm).remove();
        $(v_str_confirm).parent().append('<div id="Error_' + p_str_confirm + '" style="font-size: 75%;">' + lang.NO_MATCH + '</div> ')
        return false;
    },
    compareDate : function(txtFec1, txtFec2 ){
        var txtFec1 = new Date(txtFec1.split("/")[1] + "/" + txtFec1.split("/")[0] + "/" + txtFec1.split("/")[2])
        var txtFec2 = new Date(txtFec2.split("/")[1] + "/" + txtFec2.split("/")[0] + "/" + txtFec2.split("/")[2])
        if (txtFec1 >= txtFec2 ){
            return true
        }else{
            return false
        }



    },
    isFuture : function(txtFec1){
        var txtFec1 = new Date(txtFec1.split("/")[1] + "/" + txtFec1.split("/")[0] + "/" + txtFec1.split("/")[2])
        var txtFec2 = new Date()
        if (txtFec1 > txtFec2 ){
            return true
        }else{
            return false
        }

    },
    jqCombo : {
        load: function(obj) {
            $.ajax({
                data: obj.params,
                type: "POST",
                dataType: "json",
                url: obj.source,
                success: function(_data) {
                    data = _data.data;
                    if (_data.errors == null) {
                        $("#"+obj.id).html('');
                        $("#"+obj.id).append('<option value="-1" default="true">Seleccione...</option>');
                        $.each(data, function(index, data) {
                            util.jqCombo.add("#"+obj.id,data.id,data.glosa);
                        });
                    }
                }
            });
        },
        add : function(selector, value, text) {
            $(selector).append('<option value="' + value + '">' +text +'</option>')
        }
    }
}
util.cookies.init();








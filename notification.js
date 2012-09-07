//*** notifications **//

try{
    me.notifications = {}
    }
catch(e){
    me = {}
 }

me.notifications={}; 
me.notifications.info = {
    autor: "@fvelasquezc",
    version:"0.1",
    fechaInicio: "10/07/2012",
    descripcion: "Visor de Errores registrados por las Aplicaciones",
    fechaFin: "pendiente",
    Cambios: {
        "0.1":"Creacion"
    }
};




$(function () { 
    $.mobile.defaultDialogTransition="slide"

    me.notifications.create = function () {

    	me.notifications.getStatus(0);
        me.notifications.listaSitios();
   
    }

    me.notifications.listaSitios = function(){

        $.ajax({
        url: "wsLog/wsLog.asmx/LogListaSitios",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({}),
            success: function (data) {
                data = JSON.parse(data.d).data
                debugger;
                $.each(data, function(i,e){
                    $("#cbo_tipo_dato").append('<option value="'+ data.SitioCod+'">'+data.SitioNombre+'</option>')    
                })
                $("#cbo_tipo_dato").selectmenu("refresh");
            }
        })
    }  


    me.notifications.getStatus = function (idLastLog) {

    $.ajax({
    	url: "wsLog/wsLog.asmx/LogListaErrores",
    	dataType: "json",
    	type: "POST",
    	contentType: "application/json; charset=utf-8",
    	data: JSON.stringify({
    		idLastLog : idLastLog
    	}),
    	success: function (data) {
        
    	data = JSON.parse(data.d).data
    	if(data[0].logCodigo != 0)
			{
                debugger;
				
				for ( i= data.length -1   ; i > -1 ; i--){
                    
					var li = $('<li><a href="#detalleIncidencia" data-transition="slide">'+
				'	<p>    <b>'+ data[i].SitioNombre+' - '+ data[i].logErrorNro +'</b></p>'+
				'	<p>'+data[i].logErrorMsg+ '+</p>'+
				'	<p><b>Usuarios</b>:'+data[i].logNombreUsuario+' - <b>Estacion</b>:'+data[i].logEstacion+'  </p>'+
				'	<p><b>Metodo</b>:'+data[i].logMetodo+' - <b>Archivo</b>:'+data[i].logArchivoFuente+'  </p>'+
				'	<p class="ui-li-aside"><strong>'+data[i].logFecha+'</strong></p>'+
				'</a></li>').data(data[i]).on("click",function(){
                    var data = $(this).data()
                    $("#txtErrorCodigo").val(data.logErrorNro)
                    $("#txtSistema").val(data.SitioNombre)
                    $("#txtFecha").val(data.logFecha )
                    $("#tarMensaje").val(data.logErrorMsg)
                    $("#tarMensajeDetalle").val(data.logErrorInternoMsg)
                    $("#txtUsuario").val(data.logNombreUsuario)
                    $("#txtIps").val(data.logIp)
                    $("#txtArchivo").val(data.logArchivoFuente)
                    $("#txtMetodo").val(data.logMetodo)
                    $("#txtVersion").val(data.logVersionSistema)

                })

                
				$("#listaErrores").prepend(li);
				localStorage.idLastLog = data[0].logCodigo;

				}
				$("#listaErrores").listview("refresh");
 			} 
 			setTimeout("me.notifications.getStatus(localStorage.idLastLog)",5000)  	
    	}
    	});

    }


    me.notifications.create()
});

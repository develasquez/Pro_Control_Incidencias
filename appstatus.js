//*** appStatus **//

try{
    me.appStatus = {}
    }
catch(e){
    me = {}
 }

me.appStatus={}; 
me.appStatus.info = {
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



me.appStatus.create = function () {




localStorage.idLastLogNitificationShow=0;
$(".date").datepicker()
$("#txtFechaGraficoDesde").val(util.addDays(-7));
$("#txtFechaGraficoHasta").val(util.addDays(1)).parent().append($("<input>").attr("type","button").attr("value","Go").on("click",function(){

  $("#chart1").html("");
  me.appStatus.getGrafico();


})
)
$("#txtFechaStatusSitioDesde").val(util.getDate())
$("#txtFechaStatusSitioHasta").val(util.addDays(1)).parent().append($("<input>").attr("type","button").attr("value","Go").on("click",function(){

  me.appStatus.getSitiosSatatus();
})
)

setTimeout("me.appStatus.getSitiosSatatus()",5000) 
me.appStatus.getErroresExistentes();
me.appStatus.getNotications(0);
}
me.appStatus.getNotications= function(idLastLog){
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
      debugger;
      if(data[0].logCodigo > 0)
{
        for (i = 0 ; i< data.length ; i++){
                if (idLastLog != 0){
                  debugger;
                  localStorage.idLastLogNitificationShow = localStorage.idLastLog;
                window.webkitNotifications.requestPermission()
                var popup = window.webkitNotifications.createNotification("img/add.png",data[i].SitioNombre+' - '+ data[i].logErrorNro , data[i].logErrorMsg )
                popup.onclick = function(x) { window.focus(); this.cancel(); };
                popup.show()

                //setTimeout(function(){popup.cancel();}, '10000');

                 }
        }
      } 
      setTimeout("me.appStatus.getNotications(localStorage.idLastLog)",5000)   
      }
      });
}


me.appStatus.getErroresExistentes = function(){

$.ajax({
  url: "wsLog/wsLog.asmx/LogErroesTipo",
  dataType: "json",
  type: "POST",
  contentType: "application/json; charset=utf-8",
  data: JSON.stringify({}),
  success: function (data) {

  var dataErroresTipo = JSON.parse(data.d).data;
  var listaErrores = '<option value="0">Seleccione...</option>';
$.each(dataErroresTipo,function(index, data){

   listaErrores = listaErrores + '<option value="'+ data.logErrorNro + '">' + data.logErrorNro + '</option>'
  })

    $("#cboLinea1").append(listaErrores)
    $("#cboLinea2").append(listaErrores)
    $("#cboLinea3").append(listaErrores)

    me.appStatus.getGrafico();
  }
  });


}

me.appStatus.getSitiosSatatus = function(){

$.ajax({
  url: "wsLog/wsLog.asmx/LogSitiosStatusFecha",
  dataType: "json",
  type: "POST",
  contentType: "application/json; charset=utf-8",
  data: JSON.stringify({
    logFechaDesde:$("#txtFechaStatusSitioDesde").val(),
    logFechaHasta:$("#txtFechaStatusSitioHasta").val()
  }),
  success: function (data) {

  var dataSitios = JSON.parse(data.d).data;
$(".contenedorSitios").find(".contenedorSitio").remove();
$.each(dataSitios,function(index, data){



$(".contenedorSitios").append(
$('<div class="contenedorSitio">')
  .append($('<div class="notificacionCantidad">').text(data.errors))
  .append($('<div class="notificacionImagen">').append($('<img src="img/alert.png">')))
  .append($('<div class="notificacionImagen">'))
  .append($('<div class="iconoSitio">').append($('<img class="imagenWeb">').attr("src","img/"+ data.SitioAmbiente+".png")))
  .append($('<div class="contenedorNombreSitio">').html((data.SitioNombre.length < 23 ? data.SitioNombre+'<br>&nbsp;':data.SitioNombre ))))
 
})
 
  }
  });

}

me.appStatus.getGrafico= function(){

  $.ajax({
  url: "wsLog/wsLog.asmx/LogGraficoCodigoErrorPorFecha",
  dataType: "json",
  type: "POST",
  contentType: "application/json; charset=utf-8",
  data: JSON.stringify({
    logFechaDesde:$("#txtFechaGraficoDesde").val(),
    logFechaHasta:$("#txtFechaGraficoHasta").val(),
    error1:$("#cboLinea1").val(),
    error2:$("#cboLinea2").val(),
    error3:$("#cboLinea3").val(),
    sitioCod:0
  }),
  success: function (data) {
   
     data = JSON.parse(data.d)




var lines = [];

if ((data[0].values.length + data[1].values.length + data[2].values.length)>0    ){
 
  
  lines= [data[0].values,data[1].values,data[2].values];
  $("#labelSerie1").text(data[0].key)
  $("#labelSerie2").text(data[1].key)
  $("#labelSerie3").text(data[2].key)
  $(".labelsGrafico").show();

}else{

  lines = [[util.getDate(),0]];
  $(".labelsGrafico").hide();
}

 
  var plot1 = $.jqplot('chart1', lines, {
      title:'Codigo de Error por Fecha',
      series:[{color:'#5FAB78'},{color:'#EAA228'},{color:'#C5B47F'}],

      axes:{
        xaxis:{
          renderer:$.jqplot.DateAxisRenderer,
          tickOptions:{
           formatString:'%#d / %b / %y' 
           
          } 
        },
        yaxis:{
          tickOptions:{
            //formatString:'$%.2f'
            }
        }
      },
      highlighter: {
        show: true,
        sizeAdjust: 10
      },
      cursor: {
        show: false
      }
  });

  }
  });

 }


    me.appStatus.create()
});

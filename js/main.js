/*=========================  Siniestralidad.aspx =====================*/
main = {}; //1
main.center = new Array;
main.navegation=0
main.info = {
    autor: "@fvelasquezc",
    version: "0.1",
    fechaInicio: "16/12/2011",
    descripcion: "Maste Page",
    fechaFin: "pendiente",
    Cambios: {
        "0.1": "Creacion"
    }
};
/*====================================================================*/
$(function () {
    main.create = function () {
        this.load = function () {
            //========================Inicializacion de Controles=============*/
            main.center[main.center.length] = $("#center").html();
            $.ajax({
                url: "../WebService/LiquidacionWS.aspx",
                dataType: "json",
                type: "POST",
                data: {
                    metodo: "getMenu"
                },
                success: function (data) {
                    $("#menuPrincipalLi").append(data.data[0].menu)
                    $("#menuPrincipal").treeview({
                        persist: "cookie",
                        cookieId: "treeview-black"
                    });
                    //========================Eventos de Controles====================*/
                    $(".menuHijo").click(function () {
                        var enlace = $(this).children()[0].href.split("#")[1];
                        $("#center").html(
                        $("<div/>", {
                            id: enlace
                        }).load(enlace + ".aspx")
                        );
                        main.center[main.center.length] = enlace

                        $("#tituloCabecera").html($(this).children()[0].innerHTML);

                    })
                    //========================Fin Eventos de Controles================*/
                }
            });
            $("#panelMenu").tabs();
            $("[required]").addClass('ui-state-highlight');
            $('body').layout({ applyDefaultStyles: true });
            $(".ui-layout-center").css("padding-top", "0")

            $("#cabeceraHome").floatMenu({
                home: {
                    icon: "../img/home.png",
                    title: "Pagina Principal",
                    id: "opHome"
                },
                atras: {
                    icon: "../img/atras.png",
                    title: "Atras",
                    id: "opAtras"
                },
                adelante: {
                    icon: "../img/adelante.png",
                    title: "Adelante",
                    id: "opAdelante"
                },
                Salir: {
                    icon: "../img/salir.png",
                    title: "Salir del Sistema",
                    id: "opSalir"
                }
            });


            //========================Fin Inicializacion de Controles=========*/

            //========================Eventos de Controles====================*/


            $("#opHome").click(function () {
		main.navegation =0;
                $("#center").html(main.center[0])
            })
            $("#opAtras").click(function () {
                debugger;
                main.navegation--;
                if (main.center[main.navegation] != undefined) {
                 $("#center").html($("<div/>", {
                            id: main.center[main.navegation]
                        }).load(main.center[main.navegation] + ".aspx")
                        );
                  } else {
                    main.navegation++;
                }
            })
            $("#opAdelante").click(function () {
                
                main.navegation++;
                if (main.center[main.navegation] != undefined) {
                     $("#center").html($("<div/>", {
                            id: main.center[main.navegation]
                        }).load(main.center[main.navegation] + ".aspx")
                        );
                } else {
                    main.navegation--;
                }
            })
            $("#opSalir").click(function () {
                document.location.href = "../LoginCliente.aspx";
            })
            //========================Fin Eventos de Controles================*/
        }
        this.load();
    };
    main.create()
})

/*===============================Documentacion============================

===========================================================================*/


// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
    log.history = log.history || [];   // store logs to an array for reference
    log.history.push(arguments);
    if(this.console) {
        arguments.callee = arguments.callee.caller;
        var newarr = [].slice.call(arguments);
        (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
    }
};

// make it safe to use console.log always
(function(b){
    function c(){}
    for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){
        b[a]=b[a]||c
    }
})((function(){
    try

    {
        console.log();
        return window.console;
    }catch(err){
        return window.console={};
    
    }
})());
(function ($) {
    $.fn.history = function(){
        var self = this;
        $.fn.extend({
            load: function( url, params, callback ) {
                $.fn.history.change(self);
                return $(this).historyLoad(url, params, callback);
            }
        })
        this._currentPosition = 0
        this._body = $(this).attr("id");
        this._contents=[];
        this.back = function(el){
            
            _currentPosition= self._currentPosition;
            $.fn.history.change(self,_currentPosition);
            _currentPosition--;
            _body = self._body;
            _contents = self._contents;
            if (_contents[_currentPosition-1] != undefined) {
                $("#"+_body).empty();
                $("#"+_body).append(_contents[_currentPosition])
                self._currentPosition--;
            }  
        }
        this.forward=function(el){
            
            _currentPosition= self._currentPosition;
            $.fn.history.change(self,_currentPosition);
            _currentPosition++;
            _body = self._body;
            _contents = self._contents;
            if (_contents[_currentPosition-1] != undefined) {
                $("#"+_body).empty();
                $("#"+_body).append(_contents[_currentPosition])
                self._currentPosition++;
            } 
        }
        return this;
    }
    $.fn.historyLoad =((!$.fn.historyLoad)?$.fn.load:$.fn.historyLoad)

    $.fn.history.change=function(self,position){
    
    	if(!position){
			position = self._contents.length
			self._currentPosition++;
    	}
        _body = self._body;
        self._contents[position]= $("#"+_body).children();
        
    }
    $.fn.typeNumber= function(){
        button = $("<div/>")
        .insertAfter(this)
        .removeClass("ui-corner-all")
        .addClass("ui-corner-right ui-numberBox")
        .append($("<input/>")
            .attr("type","button")
            .addClass("ui-btnUp")
            .click($.fn.typeNumber.fn_btnUp_click)
            )
        .append($("<input/>")
            .attr("type","button")
            .addClass("ui-btnDown")
            .click($.fn.typeNumber.fn_btnDown_click)
            )
        input = button.prev()
        input.addClass("ui-numberBox-input");
        if(input.val()==""){
            input.val(0)
            };
    };
    $.fn.typeNumber.fn_btnUp_click = function(a,b,c,d){

        input = $(this).parent().prev();
        max_value = parseInt($(this).parent().prev().attr("max"))
        if(input.val()==""){
            input.val(0)
            };
        valor = parseInt(input.val())
        input.val(((valor < max_value)? valor +1:valor))
    }
    $.fn.typeNumber.fn_btnDown_click = function(a,b,c,d){
		
        input = $(this).parent().prev();
        min_value = parseInt($(this).parent().prev().attr("min"))
        if(input.val()==""){
            input.val(0)
            };
        valor = parseInt(input.val())
        input.val(((valor > min_value)? valor -1:valor))
    }
	
    $.fn.placeholder = function () {

        // Ingnoramos si el navegador soporta nativamente esta funcionalidad
        if ($.fn.placeholder.supported()) {
            return $(this);
        } else {

            // En el evento submit del formulario reseteamos los values de los inputs
            // cuyo value es igual al placeholder
            $(this).parent('form').submit(function (e) {
                $('input[placeholder].placeholder', this).val('');
            });

            // activamos el placeholder
            $(this).each(function () {
                $.fn.placeholder.on(this);
            });

            return $(this)
            // Evento on focus
            .focus(function () {
                // Desactivamos el placeholder si vamos a introducir nuevo texto
                if ($(this).hasClass('placeholder')) {
                    $.fn.placeholder.off(this);
                }
            })
            // Evento on blur
            .blur(function () {
                // Activamos el placeholder si no tiene contenido
                if ($(this).val() == '') {
                    $.fn.placeholder.on(this);
                }
            });
        }
    };

    // Funciï¿½n que detecta si el navegdor soporta el placeholder nativamente
    // Extraida de: http://diveintohtml5.org/detect.html#input-placeholder
    $.fn.placeholder.supported = function () {
        var input = document.createElement('input');
        return !!('placeholder' in input);
    };

    // Aï¿½ade el contenido del placeholder en el value del input
    $.fn.placeholder.on = function (el) {
        var $el = $(el);
        if (($el.attr('placeholder')!= "") && ($el.val()=="")){
        	
            $el.val($el.attr('placeholder'))
            $el.addClass('placeholder');
            
        }
    };
    // Borra el contenido del value
    $.fn.placeholder.off = function (el) {
        
        $(el).removeClass('placeholder');
        $(el).val('');
    };
 
    $.fn.floatMenu = function(options){
        var cantIconos = options.length;
        if(options == undefined){
            options ={
                    
                opDefault:{
                    icon:"img/opDefault.png",
                    title:"Opción",
                    id:"opDefault"
                }
            }
        }
        var element = this
        var idElement = $(this).attr("id")
        var hover = false;
        $('#menu'+idElement).remove();
        $('<div />', {
            id:'menu'+idElement
        })
        .addClass('floatMenu')
        .css("z-index","2000")
        .prependTo(element);

        $.each(options, function(position,option,b,c) { 
                
            $('<img />',{
                src:option.icon,
                title:option.title,
                id:option.id
            }).addClass('icono32').appendTo('#menu'+idElement)
        });

        $(".icono32").mousedown(function () {



            $(this).addClass("transparent")
        });
        $(".icono32").mouseup(function () {

            $(this).removeClass("transparent")
        });

        
    
    };

    $.widget("ui.combobox", {
        source: null,
        params: {},
        label: null,
        value: null,
        required: true,
        onSelect:null,
        onLoad:{},
        store:{},
        template: null,
        callback:function(){
            return true
        },
        
        _carga: function (self, query) {
            
            try{
                var params = self.options.params()
                params.query = query;
                var preValue = self.element.val();

                $.ajax({
                    url: self.options.source,
                    dataType: "json",
                    
                    contentType: "application/json; charset=utf-8",
                    type: "POST",
                    data: JSON.stringify(params),
                    success: function (data) {
                      
                        data = JSON.parse(data.d).data;
                        $("#" +self.options.id).data("store",data)
                        $("#" + self.options.id).html('');
                        $("#" + self.options.id).append('<option SELECTED></option>')
                        $.each(data, function (index, data) {
                
                            $("<option/>",{
                                value:data[self.options.value]
                            })
                            .html(data[self.options.label])
                            .data("store",data)
                            .appendTo("#" + self.options.id)
                        });
                        try{
						self.element.combobox("val",preValue);
						}catch(e){}
                        try{ 
                        self.options.callback(data)
                        }catch(e){
                        }
                        
                    }
                })
            }
            catch(e){

            
            }
        },
        _create: function () {            

            var clases = this.element.attr("class")
            var self = this
            self.options.id = $(this.element).attr("id")
            this._carga(self, "");
            var select = this.element.hide();
            var selected = select.children(":selected");
            var value = selected.val() ? selected.text() : "";
            var input = this.input = $("<input>")
            .insertAfter(select)
            .val(value)
            .autocomplete({
                delay: 0,
                minLength: 0,
                source: function (request, response) {
                    try{
                        var params = self.options.params()
                        params.query = "";
                      
                        $.ajax({
                            url: self.options.source,
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            type: "POST",
                            data: JSON.stringify(params),
                            success: function (data) {
                        
                                data = JSON.parse(data.d).data;
                                $("#" +self.options.id).data("store",data)
                                $("#" + self.options.id).html('');
                                $.each(data, function (index, data) {
                                    $("<option/>",{
                                        value:data[self.options.value]
                                    })
                                    .html(data[self.options.label])
                                    .data("store",data)
                                    .appendTo("#" + self.options.id)
                                });
                                var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                                response($("#" + self.options.id).children("option").map(function () {
                                    var text = $(this).text();
                                    if (this.value && (!request.term || matcher.test(text)))
                                        return {
                                            label: text.replace(
                                                new RegExp(
                                                    "(?![^&;]+;)(?!<[^<>]*)(" +
                                                    $.ui.autocomplete.escapeRegex(request.term) +
                                                    ")(?![^<>]*>)(?![^&;]+;)", "gi"
                                                    ), "<strong>$1</strong>"),
                                            value: text,
                                            option: this
                                        };
                                }));
                         		 
                                 try{ self.options.callback(data)}catch(e){}
                            }
                        });
                    }
                    catch(e){
                        var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                        response($("#" + self.options.id).children("option").map(function () {
                            var text = $(this).text();
                            if (this.value && (!request.term || matcher.test(text)))
                                return {
                                    label: text.replace(
                                        new RegExp(
                                            "(?![^&;]+;)(?!<[^<>]*)(" +
                                            $.ui.autocomplete.escapeRegex(request.term) +
                                            ")(?![^<>]*>)(?![^&;]+;)", "gi"
                                            ), "<strong>$1</strong>"),
                                    value: text,
                                    option: this
                                };
                        }));
                    }
                },
                select: function (event, ui) {
                    
                    ui.item.option.selected = true;
                    self._trigger("selected", event, {
                        item: ui.item.option
                    });
                    self.selectedItem = ui.item.option
                    try{
                        self.options.onSelect(self.selectedItem);
                    }catch(e){
                    }
                },
                change: function (event, ui) {
                    if (!ui.item) {
                        /*           $(self.element).val("");
                        $(self.element).html("");
                        $(self.element).attr("store","");*/
                        select.children("option").each(function () {
                          debugger;
                            this.selected  = false;
                            valid = false;
                          
                        });

                        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + 
                            "$", "i");
                        valid = false;
                        select.children("option").each(function () {

                            if ($(this).text().match(matcher)) {
                                this.selected = valid = true;
                                return false;
                            }
                        });

                    }
                }
            })
            .addClass("ui-widget ui-widget-content ui-corner-left inputCombo " + clases);
            input.attr("placeholder",
                (!self.element.attr("placeholder")?"Seleccione...":self.element.attr(
                    "placeholder")))
            if (self.options.required != null) {
                input.attr("required", "required");
            }
			input.blur(function(a,b,c,d){
					if($(input).val()==""){
						document.getElementById($(select).attr("id")).selectedIndex = -1;
					}
				})

            input.data("autocomplete")._renderItem = function (ul, item) {
                var list = $("<li></li>")
                .data("item.autocomplete", item)
                var _template = ""
                if (!self.options.template){
                    _template = ("<a>" + item.label + "</a>");
                }else
                {
                    var template = self.options.template;
                    var lastPos = 0;
                    var otherString = "";
                    var posStart =0;
                    var posEnd = 0;
                    for (i=0;i<template.length; i++){
                        posStart = template.indexOf("{",0);
                        posEnd = template.indexOf("}",0);
                        if (posStart == -1){
                            otherString += template;
                            template = "";
                        }else{
                            otherString += template.substring(0,posStart);
                            otherString += $(item.option).data().store[template.substring(posStart+1,posEnd)];
                            template = template.substring(posEnd +1 , template.length);
                        }
                    }
                    _template = "<a>" + otherString + "</a>";
                }
                list.append(_template)
                return list.appendTo(ul);
            };
            this.button = $("<button type='button'>&nbsp;</button>")
            .attr("tabIndex", -1)
            .attr("title", "Show All Items")
            .insertAfter(input)
            .button({
                icons: {
                    primary: "ui-icon-triangle-1-s"
                },
                text: false
            })
            .removeClass("ui-corner-all")
            .addClass("ui-corner-right ui-button-icon btnCombo")
            .click(function () {
             
                if (input.autocomplete("widget").is(":visible")) {
                    input.autocomplete("close");
                    return;
                }

                // work around a bug (likely same cause as #5265)
              

                // pass empty string as value to search for, displaying all results
                $(this).prev().autocomplete("search", "");
                input.focus();
            });
        },

        destroy: function () {

            this.input.remove();
            this.button.remove();
            this.element.show();
            $.Widget.prototype.destroy.call(this);
        },
        val:function(value){
     
            if (value != undefined){
                if (value==""){
                    this.input.val(value);
                }else{
                    var text = null;
                    var opcion = null;
                    this.element.children("option").each(function (index,option) {
                        if ($(option).val() == value) {
                            option.selected = true;
                            text = option.text; 
                            opcion = option;
                        }
                    });
                    this.input.val(text);
                    try{
                        this.options.onSelect(opcion);
                    }catch(e){
                    }
           
                }
            }

            return ((value != undefined )?(((this.element.val()!="") &&
                (this.element.val()!=null) &&
                (this.element.val()!=undefined) &&
                (this.input.val()!=""))? //Verifico que el imput que sigue este vacio
            this.element.val():0):this.element.val())
        },
        getJson : function(option){
            // evaluo si enviaron el parametro option si es asi lo busco dentro del combobox
            // si no viene el parametro obtengo el store del combo 

            var json = null;
            try{
                json = (option?this.element.find(option):this.element).data().store
            }
            catch(e){}
            return json
        },
        isValid : function(){

            if (this.input.attr("palceholder")== this.input.val())
            {
                return false
            }
            if (!this.element.val() && (this.element.hasClass('ui-obligatorio') || this.element.attr("required"))  ) {
                this.input.addClass('ui-state-error');
            
                return false;
            }else{
                this.input.removeClass('ui-state-error');
                return true;
            }
        },
        getSelected: function(){
            var opcion = null;
            this.element.children("option").each(function (index,option) {
                if (option.selected) {
                    opcion = option;
                }
            });
            return(opcion);
               
        }
    });

})(jQuery);


class FixedHeader
	constructor: (@option, el)->
		@table = $(el)
		@createWrappers()
		@createHeader()
		@synWidth()
		@body.bind 'scroll', @scroll
	
	createWrappers: ->
		table = $(@)
		@wrapper = $ "<div/>", {class:"fh-wrap", width: @option.width, height: @option.height}
		@header = $ "<div/>", {class: "fh-header"}
		@body = $ "<div/>", {class: "fh-body", width:@option.width}
		
		@table.wrap @wrapper 
		@table.wrap @body 
		@body = @table.parent()
		@body.before @header
		
		#wrap all tds
		@table.find("td").wrapInner "<div/>"
	

	createHeader: ->
		@header.width(@option.width - @getScrollbarWidth()) if @table.height() > @option.height
		@headerTable = $("<table/>").appendTo(@header)
		headerRow = "<tr>"
		bodyPreRow = "<tr class='fh-body-prerow'>"
		@table.find("th").each ()->
			headerRow += "<th><div>#{$(@).html()}</div></th>"
			bodyPreRow += "<td><div></div></td>"
		headerRow += "</tr>"
		bodyPreRow += "</tr>"
		@headerTable.append headerRow
		@table.find("thead").remove()
		@table.find("tbody").prepend(bodyPreRow).find('tr:eq(1)').addClass('fh-body-firstrow');
		
	synWidth: ->
		headerThs = @headerTable.find("th")
		@table.find(".fh-body-prerow td").each (index, el)=>
			td = $(el)
			th = headerThs.eq(index)
			w = Math.max td.outerWidth(), th.width()
			td.find(">div").width(w)
			th.find(">div").width(w)
			p = {}
			p["padding-#{d}"] = td.css("padding-#{d}") for d in ['left','right','top','bottom']
			th.width(w).css(p)
		@body.height(@option.height - @headerTable.height())
		
	scroll: =>
		@header.scrollLeft @body.scrollLeft()
		
	getScrollbarWidth: ->
		if !@scrollbarWidth
			parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
			child = parent.children();
			@scrollbarWidth = child.innerWidth() - child.height( 99 ).innerWidth();
			parent.remove();
		@scrollbarWidth
		

#plugin bridge
$.plugin = (name, object)->
	$.fn[name] = (options, others)->
		this.each ->
			instance = $.data(this, name)
			instance[options](others) if typeof options == 'string' && instance
			$.data this, name, new object(options, @) if !instance
		
$.plugin 'fixedHeader', FixedHeader



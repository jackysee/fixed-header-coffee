(function() {
  var FixedHeader;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  FixedHeader = (function() {
    function FixedHeader(option, el) {
      this.option = option;
      this.scroll = __bind(this.scroll, this);;
      this.table = $(el);
      this.createWrappers();
      this.createHeader();
      this.synWidth();
      this.body.bind('scroll', this.scroll);
    }
    FixedHeader.prototype.createWrappers = function() {
      var id;
      id = this.table.attr('id');
      this.wrapper = $("<div/>", {
        id: "" + id + "wrapper",
        "class": "fh-wrap",
        width: this.option.width,
        height: this.option.height
      });
      this.header = $("<div/>", {
        id: "" + id + "header",
        "class": "fh-header"
      });
      this.body = $("<div/>", {
        "class": "fh-body",
        width: this.option.width
      });
      this.table.wrap(this.wrapper);
      this.table.wrap(this.body);
      this.body = this.table.parent();
      this.body.before(this.header);
      return this.table.find("td").wrapInner("<div/>");
    };
    FixedHeader.prototype.createHeader = function() {
      var bodyPreRow, headerRow;
      if (this.table.height() > this.option.height) {
        this.header.width(this.option.width - this.getScrollbarWidth());
      }
      this.headerTable = $("<table/>").appendTo(this.header);
      headerRow = "<tr>";
      bodyPreRow = "<tr class='fh-body-prerow'>";
      this.table.find("th").each(function() {
        headerRow += "<th><div>" + ($(this).html()) + "</div></th>";
        return bodyPreRow += "<td><div></div></td>";
      });
      headerRow += "</tr>";
      bodyPreRow += "</tr>";
      this.headerTable.append(headerRow);
      this.table.find("thead").remove();
      return this.table.find("tbody").prepend(bodyPreRow).find('tr:eq(1)').addClass('fh-body-firstrow');
    };
    FixedHeader.prototype.synWidth = function() {
      var headerThs;
      headerThs = this.headerTable.find("th");
      this.table.find(".fh-body-prerow td").each(__bind(function(index, el) {
        var d, p, td, th, w, _i, _len, _ref;
        td = $(el);
        th = headerThs.eq(index);
        w = Math.max(td.outerWidth(), th.width());
        td.find(">div").width(w);
        th.find(">div").width(w);
        p = {};
        _ref = ['left', 'right', 'top', 'bottom'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          d = _ref[_i];
          p["padding-" + d] = td.css("padding-" + d);
        }
        return th.width(w).css(p);
      }, this));
      return this.body.height(this.option.height - this.headerTable.height());
    };
    FixedHeader.prototype.scroll = function() {
      return this.header.scrollLeft(this.body.scrollLeft());
    };
    FixedHeader.prototype.getScrollbarWidth = function() {
      var child, parent;
      if (!this.scrollbarWidth) {
        parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
        child = parent.children();
        this.scrollbarWidth = child.innerWidth() - child.height(99).innerWidth();
        parent.remove();
      }
      return this.scrollbarWidth;
    };
    return FixedHeader;
  })();
  $.plugin = function(name, object) {
    return $.fn[name] = function(options, others) {
      return this.each(function() {
        var instance;
        instance = $.data(this, name);
        if (typeof options === 'string' && instance) {
          instance[options](others);
        }
        if (!instance) {
          return $.data(this, name, new object(options, this));
        }
      });
    };
  };
  $.plugin('fixedHeader', FixedHeader);
}).call(this);

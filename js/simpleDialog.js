/*
 * create by sliwey
 *
 * create time : 2014-7-18
 *
 * update time : 2014-7-28
 *
 * description : simple dialog
 * 
 */
;(function($) {
	var defaults = {
		title : "提示",
		cover : true,
		content : "Hello World!",
		beforeClose : null,
        dragable: true,
        width : "auto",
        height : "auto",
        left : null,
        top : null,
        resizeable : true
	};
	
	$.fn.extend({
		simpleDialog : function(options) {
			var setting = $.extend({}, defaults, options);
			init(setting, this);
			return this ;
		},
		dialogOpen : function() {
			this.show();
			return this;
		},
		dialogClose : function() {
            this.html('');
			this.hide();
			$(".dialog_cover").remove();
			return this;
		}
	});
	
	var init = function(setting, _this) {
		var title = setting.title || '&nbsp;';
		_this.addClass("dialog")
			 .append("<div class=\"dialog_title\"><h1 class=\"dialog_title_msg\">" + title + "</h1><button class=\"dialog_close\" title=\"关闭\">&times;</button></div>")
			 .append(setting.content);

        // 设置大小
        _this.css({"width" : setting.width, "height" : setting.height});

        // 设置位置
        if (setting.left !== null && setting.top !== null) {
            _this.css({"left" : setting.left, "top" : setting.top});
        } else {
            var mLeft = -_this.width() / 2,
                mTop = -_this.height() / 2,
                left = $(window).width() * 0.5 + "px",
                top = $(window).height() * 0.5 + "px";
            _this.css({"left" : left, "top" : top, "margin-left" : mLeft, "margin-top" : mTop});
        }

		_this.find(".dialog_close").on("click", function() {
            // 执行关闭前的回调函数
			setting.beforeClose && typeof setting.beforeClose == "function" && setting.beforeClose();

			_this.dialogClose();
		});

        setting.cover && _this.parents("body").append("<div class=\"dialog_cover\"></div>");
        setting.dragable && drag(_this);
        setting.resizeable && resize(_this);
	};

    // 拖动
    var drag = function(_this) {
        var temX,
            temY,
            obj = _this.find(".dialog_title"),
            moveable = false,
            width = $(document).width(),
            height = $(document).height();

        obj.css("cursor", "move");
        obj.on("mousedown", function(event) {
            var e = event || window.event;
            temX = e.pageX - _this.offset().left;
            temY = e.pageY - _this.offset().top;
            moveable = true;
        });

        $(document).on({
            mouseup : function() {
                if (moveable) {
                    moveable = false;
                }
            },
            mousemove : function(event) {
                var e = event || window.event;
                if (moveable) {
                    var left = e.pageX - temX,
                        top = e.pageY - temY,
                        w = _this.width(),
                        h = _this.height();

                    left = left < 0
                           ? 0
                           : left + w > width
                             ? width - w
                             : left;
                    top = top < 0
                          ? 0
                          : top + h > height
                            ? height - h
                            : top;
                    _this.css({"left" : left, "top" : top, "margin" : 0});
                }
                return e.preventDefault();
            }
        });
    };

    /* 调整大小
     *
     * type:调整方向，"n","s","w","e","nw","ne","sw","se" 分别对应上、下、左、右、左上、右上、左下、右下
     *
     */
    var resize = function(_this) {
        var temX,
            temY,
            type,
            typeList = ["n", "s", "w", "e", "nw", "ne", "sw", "se"],
            length = typeList.length,
            resizeable = false,
            width = _this.width(),
            height = _this.height(),
            left,
            top,
            mWidth = _this.css("min-width").slice(0, -2),
            mHeight = _this.css("min-height").slice(0, -2);

        _this.append("<div class=\"n-resize\"></div>")
             .append("<div class=\"s-resize\"></div>")
             .append("<div class=\"w-resize\"></div>")
             .append("<div class=\"e-resize\"></div>")
             .append("<div class=\"nw-resize\"></div>")
             .append("<div class=\"ne-resize\"></div>")
             .append("<div class=\"sw-resize\"></div>")
             .append("<div class=\"se-resize\"></div>");

        for (var i = 0; i < length; i++) {
            (function(i){
                $("." + typeList[i] + "-resize").on("mousedown", function(event) {
                    var e = event || window.event;
                    temX = e.pageX;
                    temY = e.pageY;
                    top = _this.offset().top;
                    left = _this.offset().left;
                    type = typeList[i];
                    resizeable = true;
                });
            })(i);
        }

        $(document).on({
            mouseup : function() {
                if (resizeable) {
                    width = _this.width();
                    height = _this.height();
                    top = _this.offset().top;
                    left = _this.offset().left;
                    resizeable = false;
                }
            },
            mousemove : function(event) {
                var e = event || window.event;
                var docWidth = $(document).width(),
                    docHeight = $(document).height();

                if (resizeable) {
                    var w = e.pageX - temX,
                        h = e.pageY - temY;

                    changeSize[type](w, h, docWidth, docHeight);
                }
                return e.preventDefault();
            }
        });

        var changeSize = {
            "n" : function(w, h, docWidth, docHeight) {
                if (top + h >= 0 && height - h >= mHeight) {
                    _this.css({"top": top + h, "height" : height - h, "margin-top" : 0});
                }
            },
            "s" : function(w, h, docWidth, docHeight) {
                if (height + h >= mHeight && height + h + top < docHeight) {
                    _this.css("height", height + h);
                }
            },
            "w" : function(w, h, docWidth, docHeight) {
                if (left + w >= 0 && width - w >= mWidth) {
                    _this.css({"left" : left + w, "width" : width - w, "margin-left" : 0});
                }
            },
            "e" : function(w, h, docWidth, docHeight) {
                if (width + w >= mWidth && width + w + left < docWidth) {
                    _this.css("width", width + w);
                }
            },
            "nw" : function(w, h, docWidth, docHeight) {
                if (top + h >= 0 && height - h >= mHeight) {
                    _this.css({"top" : top + h, "height" : height - h, "margin-top" : 0});
                }
                if (left + w >= 0 && width - w >= mWidth) {
                    _this.css({"left" : left + w, "width" : width - w, "margin-left" : 0});
                }
            },
            "ne" : function(w, h, docWidth, docHeight) {
                if (top + h >= 0 && height - h >= mHeight) {
                    _this.css({"top" : top + h, "height" : height - h, "margin-top" : 0});
                }
                if (width + w >= mWidth && width + w + left < docWidth) {
                    _this.css({"width" : width + w});
                }
            },
            "sw" : function(w, h, docWidth, docHeight) {
                if (height + h >= mHeight && height + h + top < docHeight) {
                    _this.css({"height" : height + h});
                }
                if (left + w >= 0 && width - w >= mWidth) {
                    _this.css({"left" : left + w, "width" : width - w, "margin-left" : 0});
                }
            },
            "se" : function(w, h, docWidth, docHeight) {
                if (height + h >= mHeight && height + h + top < docHeight) {
                    _this.css({"height" : height + h});
                }
                if (width + w >= mWidth && width + w + left < docWidth) {
                    _this.css({"width" : width + w});
                }
            }
        };
    };
})(jQuery);
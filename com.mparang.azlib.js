/*
 * title: azlib script library
 * date: create: 2014-12-31 yonghun, lee
 * contact: metalsm7@gmail.com (yonghun, lee)
 */

var azlib = function() {
	var $p_value = null;

	$p_value = arguments[0];

	//
	if (typeof($p_value) == 'string') {

        if (document.getElementsByName($p_value).length > 1) {
            // 동일한 id값을 가지는 객체의 갯수가 2개 이상인 경우
            $p_value = document.getElementsByName($p_value);
        } 
        else {
            // 유일한 id인 경우
            $p_value = document.getElementById($p_value);
            if ($p_value == undefined || $p_value == null) {
                if (document.getElementsByName($p_value).length == 1) 
                    $p_value = document.getElementsByName($p_value)[0];
            }
        }

        if ($p_value == null || $p_value == undefined) {
			//throw new Error('target object not exist.');
			return;
        }
	};

	$p_value.is_azlib = true;

	$p_value.getPropertyNames = function() {
		var rtnValue = [];
		for (var obj in this) {
			try {
				if (obj.name != undefined) {
					rtnValue[rtnValue.length] = String(obj);
				}
			}
			catch (ex) {
				continue;
			}
		}
		return rtnValue;
	};
	
	$p_value.hasProperty = function(p_value) {
		var rtnValue = false;
		var list = getPropertyNames();
		for (var cnti=0; cnti<list.length; cnti++) {
			if (list[cnti] == p_value) {
				rtnValue = true;
				break;
			}
		}
		return rtnValue;
	};

	$p_value.getAttributeNames = function() {
		var rtnValue = [];
		for (var cnti=0; cnti<this.attributes.length; cnti++) {
			var obj = this.attributes[cnti];
			try {
				if (obj.name != undefined) {
					rtnValue[rtnValue.length] = obj.name;
				}
			}
			catch (ex) {
				continue;
			}
			obj = null;
		}
		return rtnValue;
	};

	$p_value.hasAttribute = function(p_value) {
		var rtnValue = false;
		var list = getAttributeNames();
		for (var cnti=0; cnti<list.length; cnti++) {
			if (list[cnti] == p_value) {
				rtnValue = true;
				break;
			}
		}
		return rtnValue;
	};

	$p_value.setBounds = function(p_json) {
		this.style.left = p_json.x + 'px';
		this.style.top = p_json.y + 'px';
		this.style.width = p_json.width + 'px';
		this.style.height = p_json.height + 'px';
		return this;
	}

	$p_value.getBounds = function() {
		var rtnValue = new azlib.graphic.Bounds();

		//
		var obj = this;

		//
        do {
            rtnValue.x += parseInt(obj.offsetLeft);
            rtnValue.y += parseInt(obj.offsetTop);
            obj = obj.offsetParent;
        }
        while (obj);

        if (!azlib.isNull(obj)) {
            if (rtnValue.x == - 1 && rtnValue.y == - 1 && obj.style.position == 'absolute') {
                rtnValue.x = Number(String(obj.style.left).replace('px', ''));
                rtnValue.y = Number(String(obj.style.top).replace('px', ''));
            }
        }

        //
        obj = this;

        //
        rtnValue.width = obj.scrollWidth;
        if (Number(rtnValue.width) == 0) {
            rtnValue.width = obj.style.width.replace('px', '');
        }
        try {
            if (obj.tagName.toLowerCase() == 'textarea') {
                if (Number(obj.style.pixelWidth) > 0) {
                    rtnValue.width = String(obj.style.pixelWidth).replace('px', '');
                }
            }
        } catch (e) {}

        //
        rtnValue.height = obj.scrollHeight;
        if (Number(rtnValue.height) == 0) {
            rtnValue.height = obj.style.height.replace('px', '');
        }

        obj = null;

		return rtnValue;
		//return {x:1, y:2, width:10, height:20};
		//return new azlib.graphic.Bounds.init(1, 2, 10, 20);
	};

	$p_value.show = function() {
		try { this.style.display = 'block'; } catch (e) {}
		return $p_value;
	};

	$p_value.hide = function() {
		try { this.style.display = 'none'; } catch (e) {}
		return $p_value;
	};

	$p_value.append = function(p_target) {
		return azlib.append(this, p_target);
	}

	$p_value.remove = function(p_target) {
		azlib.remove(this, p_target);
	}

	$p_value.toggle = function() {
		try { 
			if (this.style.display == 'none') {
				this.show();
			}
			else {
				this.hide()
			}
		} 
		catch (e) {}
		return $p_value;
	};

	$p_value.html = function(p_html) {
		this.innerHTML = p_html;
		return this;
	}

	$p_value.alpha = 1.0;

	$p_value.setAlpha = function(p_value) {
		this.alpha = p_value;
		azlib.graphic.setAlpha(this, p_value);
		return this;
	};

	$p_value.fade = function(p_json) {
		if (azlib.isNull(p_json)) { p_json = {duration:500, start:1.0, end:0.0}; }

		if (azlib.isNull(p_json.end)) {
	        throw new Error('end 값이 정해져있지 않습니다.');
	        return;
		}
		if (azlib.isNull(p_json.duration)) { p_json.duration = 500; }

		if (azlib.css3.isSupportCSS3()) {
			// css3 지원시
			var class_name = 'easeinout_' + ''.makeRandom();
			azlib.css3.create(azlib.css3.CSS3_TYPE_TRANSITION_EASEINOUT, class_name, {sec: (Number(p_json.duration) / 1000.0)});
			
			this.className = '';

			if (!azlib.isNull(p_json.start)) {
				this.alpha(p_json.start);

				var doDraw = function() {
					$p_value.className = class_name;
					$p_value.alpha(!azlib.isNull(p_json.end) ? p_json.end : 0.0);
				};
				setTimeout(doDraw, 100);
			}
			else {
				this.className = class_name;
				this.alpha(!azlib.isNull(p_json.end) ? p_json.end : 0.0);
			}
		}
		else {

		}
		return this;
	};

	$p_value.fadein = function() {
		return this.fade({duration:500, start:0.0, end:1.0});
	};

	$p_value.fadeout = function() {
		return this.fade({duration:500, start:1.0, end:0.0});
	};

	$p_value.moveOnDrag = function() {
		azlib.graphic.moveOnDrag(this);
		return this;
	}

	$p_value.css = {
		append: function(p_value) {
			$p_value.style.cssText += $p_value.style.cssText.length > 0 ? ' ' : '' + p_value;
			return $p_value;
		},
		set: function(p_value) {
			$p_value.style.cssText = p_value;
			return $p_value;
		},
		get: function(p_value) {
			return $p_value.style.cssText;
		},
		clear: function() {
			$p_value.style.cssText = '';
			return $p_value;
		}
	};

	$p_value.form = {
		post: function(p_json) {
			var obj = $p_value;

			/*
			if (obj.tagName.toLowerCase() != 'form') {
				throw new Error('target object\'s tagname must be form.');
				return;
			}
			*/

			p_json.form = obj;

			azlib.form.post(p_json);

			return $p_value;
		}
	};

	$p_value.ani = {
		open: function(p_json) {
			var obj = $p_value;

			var json = {
				start_height: 0, 
				end_height: obj.getBounds().height, 
				duration: p_json.duration, 
				on_success: p_json.on_success
			};
			$p_value.ani.resize(json);
			return $p_value;
		},
		close: function(p_json) {
			var obj = $p_value;

			var json = {
				start_height: obj.getBounds().height, 
				end_height: 0, 
				duration: p_json.duration, 
				on_success: p_json.on_success
			};
			$p_value.ani.resize(json);
			return $p_value;
		},
		move: function(p_json) {
			var obj = $p_value;

			var ani_value = {
				start_x: azlib.isNull(p_json.start_x) ? 0 : p_json.start_x,
				end_x: azlib.isNull(p_json.end_x) ? 0 : p_json.end_x,
				start_y: azlib.isNull(p_json.start_y) ? 0 : p_json.start_y, 
				end_y: azlib.isNull(p_json.end_y) ? 0 : p_json.end_y, 
				current_x: p_json.start_x,
				current_y: p_json.start_y,
				duration: p_json.duration,
				start_time: new Date()
			};

			doDraw = function() {
				var passed_time = (new Date()) - ani_value.start_time;

				if (ani_value.duration > passed_time) {
					try {
						if (ani_value.start_x < ani_value.end_x) {

						}
						else {

						}

						if (ani_value.start_y < ani_value.end_y) {

						}
						else {
							
						}
						
						if (ani_value.start_height != ani_value.end_height) {
							obj.style.pixelHeight = ani_value.current_height;
						}
						
						if (ani_value.start_width != ani_value.end_width) {
							obj.style.pixelWidth = ani_value.current_width;
						}

						//doDraw();
						setTimeout(doDraw, 10);
					}
					catch (ex) {
						if (!azlib.isNull(p_json.on_fail)) {
							if (typeof(p_json.on_fail) == 'object' ||
								typeof(p_json.on_fail) == 'function') {
								p_json.on_fail();
							}
						}
					}
				}
				else {
					if (ani_value.start_height != ani_value.end_height) {
						obj.style.pixelHeight = ani_value.end_height;
					}
					if (ani_value.start_width != ani_value.end_width) {
						obj.style.pixelWidth = ani_value.end_width;
					}

					//obj.style.overflow = 'scroll';
					//obj.style.overflow = obj.getAttribute('overflow_original');

					if (!azlib.isNull(p_json.on_success)) {
						if (typeof(p_json.on_success) == 'object' ||
							typeof(p_json.on_success) == 'function') {
							p_json.on_success();
						}
					}
				}
			}
			doDraw();
		},
		resize: function(p_json) {
			var obj = $p_value;

			obj.setAttribute('overflow_original', obj.style.overflow);
			//obj.setAttribute('schollHeight_original', p_json.start_height);

			obj.style.overflow = 'hidden';

			var ani_value = {
				start_width: azlib.isNull(p_json.start_width) ? 0 : p_json.start_width,
				end_width: azlib.isNull(p_json.end_width) ? 0 : p_json.end_width,
				start_height: azlib.isNull(p_json.start_height) ? 0 : p_json.start_height, 
				end_height: azlib.isNull(p_json.end_height) ? 0 : p_json.end_height, 
				current_height: p_json.start_height,
				current_width: p_json.start_width,
				duration: p_json.duration,
				start_time: new Date()
			};

			doDraw = function() {
				var passed_time = (new Date()) - ani_value.start_time;

				if (ani_value.duration > passed_time) {
					try {
						if (ani_value.start_height > ani_value.end_height) {
							ani_value.current_height = 
								ani_value.start_height 
								- (ani_value.start_height - ani_value.end_height) 
								* (passed_time / ani_value.duration);
						}
						else {
							ani_value.current_height = 
								(ani_value.end_height - ani_value.start_height) 
								* (passed_time / ani_value.duration);
						}

						if (ani_value.start_width > ani_value.end_width) {
							ani_value.current_width = 
								ani_value.start_width 
								- (ani_value.start_width - ani_value.end_width) 
								* (passed_time / ani_value.duration);
						}
						else {
							ani_value.current_width = 
								(ani_value.end_width - ani_value.start_width) 
								* (passed_time / ani_value.duration);
						}
						
						if (ani_value.start_height != ani_value.end_height) {
							obj.style.pixelHeight = ani_value.current_height;
						}
						
						if (ani_value.start_width != ani_value.end_width) {
							obj.style.pixelWidth = ani_value.current_width;
						}

						//doDraw();
						setTimeout(doDraw, 10);
					}
					catch (ex) {
						if (!azlib.isNull(p_json.on_fail)) {
							if (typeof(p_json.on_fail) == 'object' ||
								typeof(p_json.on_fail) == 'function') {
								p_json.on_fail();
							}
						}
					}
				}
				else {
					if (ani_value.start_height != ani_value.end_height) {
						obj.style.pixelHeight = ani_value.end_height;
					}
					if (ani_value.start_width != ani_value.end_width) {
						obj.style.pixelWidth = ani_value.end_width;
					}

					//obj.style.overflow = 'scroll';
					//obj.style.overflow = obj.getAttribute('overflow_original');

					if (!azlib.isNull(p_json.on_success)) {
						if (typeof(p_json.on_success) == 'object' ||
							typeof(p_json.on_success) == 'function') {
							p_json.on_success();
						}
					}
				}
			}
			doDraw();
		}
	};
	/*
	var Func = {
		init: function(p_value) {
			this.get = function() {
				return p_value;
			}
		}
	};

	return new Func.init(p_value);
	*/
	return $p_value;
};

/**
 * null or undefined check
 * 작성일 : 2015-01-06 이용훈
 */
azlib.isNull = function(p_value) {
	return (p_value == null || p_value == undefined) ? true : false;
};

azlib.makeBG = function(p_json) {
	if (azlib.isNull(azlib.makebgs)) { azlib.makebgs = []; }

	if (azlib.isNull(p_json)) { p_json = {alpha:0.2, color:'#000000', duration:100}; }
	if (azlib.isNull(p_json.duration)) { p_json.duration = 100; }
	if (azlib.isNull(p_json.alpha)) { p_json.alpha = 0.2; }
	if (azlib.isNull(p_json.color)) { p_json.alpha = '#000000'; }

	var w = window,
	    d = document,
	    e = d.documentElement,
	    g = d.getElementsByTagName('body')[0],
	    x = w.innerWidth || e.clientWidth || g.clientWidth,
	    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

	var obj_id = 'makebg_' + '{"size":10}'.makeRandom();
	var bg_obj = azlib.create({tag:'DIV', id:obj_id});
	bg_obj.css.set('position:absolute; left:0px; top:0px; width:' + x + 'px; height:' + y + 'px; background-color:' + p_json.color + ';');
	bg_obj.alpha(p_json.alpha);
	azlib.append(bg_obj);

	bg_obj.fade({start:0.0, end:p_json.alpha, duration:p_json.duration});

	azlib.makebgs.push(bg_obj);
};

azlib.removeBG = function() {
	if (azlib.isNull(azlib.makebgs)) {
		return;
	}
	var bg_id = azlib.makebgs.pop();
	if (azlib.isNull(bg_id)) {
		return;
	}
	var bg_obj = azlib(bg_id);
	if (azlib.isNull(bg_obj)) {
		return;
	}

	bg_obj.fade({end:0.0, duration:200});

	var doDraw = function() {
		azlib.remove(bg_obj);
	}
	setTimeout(doDraw, 500);

	return bg_id;
};

azlib.removeAllBG = function() {
	while (true) {
		var resValue = azlib.removeBG();
		if (resValue == undefined) {
			break;
		}
	}
};

azlib.create = function(p_json) {
	var rtnValue = null;

	var tag = p_json.tag;
	var id = p_json.id;
	var type = p_json.type;
	var value = p_json.value;

	if (tag.toLowerCase() == 'iframe') {
        try {
            rtnValue = document.createElement('<iframe name="' + azlib.isNull(id) ? '' : id + '" src="">');
        }
        catch (e) {
            rtnValue = document.createElement('IFRAME');
        }
	}
	else {
		rtnValue = document.createElement(tag);
	}

	if (!azlib.isNull(id)) {
	    rtnValue.setAttribute('id', id);
	    rtnValue.id = id;
	    rtnValue.setAttribute('name', id);
	    rtnValue.name = id;
	}

	if (!azlib.isNull(type)) {
	    rtnValue.setAttribute('type', type);
	    rtnValue.type = type;
	}

	if (!azlib.isNull(value)) {
	    rtnValue.setAttribute('value', value);
	    rtnValue.value = value;
	}

    return azlib(rtnValue);
}

azlib.append = function(p_value, p_target) {
	if (azlib.isNull(p_target)) { p_target = document.body; }
    if (azlib.isNull(p_target)) {
        throw new Error('대상 객체가 없습니다.');
        return;
    }
    if (typeof (p_value) == 'string') {
        p_value = azlib(p_value);
    }
    p_target.appendChild(p_value);
    return azlib.isNull(p_value.is_azlib) ? azlib(p_value) : p_value;
}

azlib.remove = function(p_value, p_target) {
	if (azlib.isNull(p_target)) { p_target = document.body; }
    if (azlib.isNull(p_target)) {
        throw new Error('대상 객체가 없습니다.');
        return;
    }
    if (typeof (p_value) == 'string') {
        p_value = azlib(Ap_value);
    }
    p_target.removeChild(p_value);
}

azlib.string = {
	appendPrototype: function() {
		String.prototype.RANDOM_TYPE_CHARACTER_ONLY = 'string';
		String.prototype.RANDOM_TYPE_NUMBER_ONLY = 'number';
		String.prototype.RANDOM_TYPE_CHARACTER_AND_NUMBER = 'mix';

		String.prototype.toInt = function(p_default) {
			return azlib.string.toInt(this, p_default);
		};
		String.prototype.format = function(p_input_format, p_output_format) {
			return azlib.string.toFormatString(this, p_input_format, p_output_format);
		};
		String.prototype.currency = function() {
			return azlib.string.toCurrencyString(this);
		};
		String.prototype.replaceAll = function(p_target, p_replace) {
			return azlib.string.replaceAll(this, p_target, p_replace);
		};
		String.prototype.reverse = function() {
			return azlib.string.toReverseString(this);
		};
		String.prototype.hasChars = function(p_value) {
			return azlib.string.isCompareStringOnly(this, p_value);
		};
		String.prototype.byteLength = function() {
			return azlib.string.getByteLength(this);
		};
		String.prototype.startsWith = function(p_value) {
			return (this.length > 0 && this.indexOf(p_value) == 0) ? true : false;
		};
		String.prototype.endsWith = function(p_value) {
			return (this.lastIndexOf(p_value) > -1 && this.length > 0 && this.lastIndexOf(p_value) == (this.length - p_value.length)) ? true : false;
		};
		String.prototype.makeRandom = function(p_type, p_size) {
			var rtnValue = '';
			var default_size = 3;
			var default_type = String.prototype.RANDOM_TYPE_CHARACTER_AND_NUMBER;

			if (azlib.isNull(p_type) && azlib.isNull(p_size)) {
				var json = JSON.parse((this.startsWith('{') ? '' : '{') + this + (this.endsWith('}') ? '' : '}'));

				var size = default_size;
				var type = default_type;

				if (!azlib.isNull(json.size)) {
					size = json.size;
				}

				if (!azlib.isNull(json.type)) {
					type = json.type;
				}

				rtnValue = azlib.string.makeRandomString(type, size);
			}
			else {
				rtnValue = azlib.string.makeRandomString(azlib.isNull(p_type) ? default_type : p_type, azlib.isNull(p_size) ? default_size : p_size);
			}

			return rtnValue;
		};
		String.prototype.toJSONSafeEncoding = function() {
			return azlib.string.toJSONSafeEncoding(this);
		};
		String.prototype.toJSONSafeDecoding = function() {
			return azlib.string.toJSONSafeDecoding(this);
		};
		String.prototype.toAZData = function() {
			return azlib.string.toAZData(this);
		};
		String.prototype.getData = function() {
			return azlib.string.toAZData(this);
		};
		String.prototype.toAZList = function() {
			return azlib.string.toAZList(this);
		};
		String.prototype.getList = function() {
			return azlib.string.toAZList(this);
		};
	},
	/*
    fromEditorString: function (A) {
        var rtnValue = typeof (A) == 'string' ? A : A.innerHTML;
        rtnValue = azlib.string.replaceAll(rtnValue, '<P>', '<P style="font-size:12px;">');
        rtnValue = azlib.string.replaceAll(rtnValue, '<p>', '<p style="font-size:12px;">');
        rtnValue = azlib.string.replaceAll(rtnValue, ' size=1', ' style="font-size:12px;"');
        rtnValue = azlib.string.replaceAll(rtnValue, ' size="1"', ' style="font-size:12px;"');
        rtnValue = azlib.string.replaceAll(rtnValue, ' size=2', ' style="font-size:13px;"');
        rtnValue = azlib.string.replaceAll(rtnValue, ' size="2"', ' style="font-size:13px;"');
        rtnValue = azlib.string.replaceAll(rtnValue, ' size=3', ' style="font-size:16px;"');
        rtnValue = azlib.string.replaceAll(rtnValue, ' size="3"', ' style="font-size:16px;"');
        rtnValue = azlib.string.replaceAll(rtnValue, ' size=4', ' style="font-size:18px;"');
        rtnValue = azlib.string.replaceAll(rtnValue, ' size="4"', ' style="font-size:18px;"');
        rtnValue = azlib.string.replaceAll(rtnValue, ' size=5', ' style="font-size:24px;"');
        rtnValue = azlib.string.replaceAll(rtnValue, ' size="5"', ' style="font-size:24px;"');
        if (typeof (A) != 'string') 
            A.innerHTML = rtnValue;
        return rtnValue;
    },
    */
    toInt: function(p_string, p_default) {
		var rtnValue = (azlib.isNull(p_default) || isNaN(p_default)) ? -1 : Number(p_default);
		if (typeof(p_string) == 'string' || typeof(p_string) == 'object') {
			if (!isNaN(p_string)) {
				rtnValue = Number(p_string);
			}
		}
		return rtnValue;
    },
    /**
        * 입력받은 문자열에 대해 특정 규칙에 의한 문자열 변환을 한다 // 2010-11-17 이용훈
        *
        * @param {string} : 원문자
        * @param {string} : 원문자에 대한 조합용 문자
        * @param {string} : 조합용 문자를 사용한 출력 문자
        * @return {string} : 원문자에 대해 설정된 조합용 문자의 조합된 결과값 반환
        *
        * 주의 : B인수의 경우 알파벳 대/소문자만 사용가능
        * 예) 인수 A, B, C에 대해 각각 abcdefg1234, AAAABCCDEFF, AAAA-FF-B-D-CC 의 경우 ->
        *       결과값은 abcd-34-e-1-fg 를 반환하게 된다.
        * 예) A, B, C에 대해 각각 19801113, YYYYMMDD, YYYY-MM-DD 의 경우 -> 1980-11-13 을 반환한다.
        */
    toFormatString: function (A, B, C) {
        var rtnValue = C;
        if (typeof (A) != 'string' || typeof (B) != 'string' || typeof (C) != 'string') {
            return null;
        }
        if (A.length != B.length) {
            throw new Error('1번째와 2번째 인수의 문자열 길이가 동일해야 합니다.');
            return null;
        }
        for (var cnti = 0; cnti < B.length; cnti++) {
            var x = B.substring(cnti, cnti + 1);
            if (('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz').indexOf(x) < 0) {
                throw new Error('2번째 인수로는 A~Z, a~z까지의 영문자만 사용가능 합니다.');
                return null;
            }
        }

        var $arr = new Array();
        var formatData = function (pCharacter, pString, pValue) {
            this.character = pCharacter;
            this.string = pString;
            this.value = pValue;
        }
        var prevCharacter = '';
        var prevString = '';
        var prevStartIdx = 0;
        var prevEndIdx = 0;
        var arrIdx = 0;
        for (var cnti = 0; cnti < (B + '|').length; cnti++) {
            var x = (B + '|').substring(cnti, cnti + 1);

            if (prevCharacter != x) {
                if (cnti > 0) {
                    $arr[arrIdx] = new formatData(prevCharacter, prevString, A.substring(prevStartIdx, prevEndIdx + 1));
                    ++arrIdx;
                }

                prevStartIdx = cnti;
                prevCharacter = x;
                prevString = x;
                prevEndIdx = cnti;
            } else {
                prevString += x;
                prevEndIdx = cnti;
            }
        }

        for (var cnti = 0; cnti < $arr.length; cnti++) {
            rtnValue = azlib.string.replaceAll(rtnValue, $arr[cnti].string, $arr[cnti].value);
        }

        return rtnValue;
    },
    /**
        *입력받은 문자열 중 B에 해당하는 문자열이 있으면 C로 모두 치환한다.	 // 2010-11-16 이용훈
        *
        * @param {string} : 원문자
        * @param {string} : 원문자에 대해 변경을 원하는 문자/문자열
        * @param {string} : 변경을 원하는 문자/문자열의 변경할 문자/문자열
        * @return {string} : 원문자 중 B 문자/문자열을 C로 치환한 문자열 반환
        */
    replaceAll: function (A, B, C) {
        var rtnValue = '';
        var remainStr = A;
        while (remainStr.indexOf(B) != - 1) {
            var replaceStr = remainStr.substring(remainStr.indexOf(B), remainStr.indexOf(B) + B.length);
            rtnValue += remainStr.substring(0, remainStr.indexOf(B)) + C;
            remainStr = remainStr.substring(remainStr.indexOf(B) + B.length, remainStr.length);
        }
        rtnValue += remainStr;

        return rtnValue;
    },
    /**
        * 입력받은 문자열의 byte수를 반환한다.	// 2010-11-16 이용훈
        *
        * @param {string} : 문자열
        * @return {number} : 문자열의 전체 바이트수 반환
        */
    getByteLength: function (A) {
        var rtnValue = 0;

        for (i = 0; i < A.length; i++) {
            if (escape(A.charAt(i)).length >= 4) {
                rtnValue += 2;
            } else {
                if (escape(A.charAt(i)) != "%0D")
                ++rtnValue;
            }
        }
        return rtnValue;
    },
    /**
        * 입력받은 문자열을 회계형식(세자리마다 ,)으로 변환한다.	// 2010-11-16 이용훈
        *
        * @param {string/number} : 원문자/숫자
        * @return {string} : 원자료에 대해 오른쪽에서 세자리마자 "," 문자를 추가 후 반환
        */
    toCurrencyString: function (pNumber) {
        var dmyValue = pNumber;
        var rtnValue = '';
        var preString = '';

        if ('1234567890'.indexOf(String(dmyValue).substring(0, 1)) < 0) {
            preString = dmyValue.substring(0, 1);
            dmyValue = dmyValue.substring(1, String(dmyValue).length);
        }

        for (var cnti = String(dmyValue).length - 1; cnti >= 0; cnti--) {
            rtnValue += String(dmyValue).substring(cnti, cnti + 1);
        }

        dmyValue = rtnValue;
        rtnValue = '';
        for (var cnti = 0; cnti < String(dmyValue).length; cnti++) {
            rtnValue += String(dmyValue).substring(cnti, cnti + 1);

            if ((cnti + 1) % 3 == 0 && cnti > 0 && cnti < String(dmyValue).length - 1) 
                rtnValue += ',';
        }

        dmyValue = rtnValue;
        rtnValue = '';
        for (var cnti = String(dmyValue).length - 1; cnti >= 0; cnti--) {
            rtnValue += String(dmyValue).substring(cnti, cnti + 1);
        }

        return preString + rtnValue;
    },
    /**
        * 입력받은 문자열의 순서를 뒤집는다	// 2010-11-16 이용훈
        *
        * @param {string} : 원문자
        * @return {string} : 원문자에 대해 배열순서를 좌우로 뒤집어 반환
        */
    toReverseString: function (A) {
        var totCnt;
        var rtnValue = '';

        totCnt = Number(A.length);

        for (var cnti = 0; cnti < totCnt; cnti++) {
            var dmy = A.substring(A.length - cnti - 1, A.length - cnti);
            rtnValue += dmy;
        }
        totCnt = null;

        return rtnValue;
    },
    /**
        * 두번째 인수로 받은 문자열 중 첫번째 인수의 문자열중에 일치하는 문자열이 없는지 확인용
        * 
        * @param {string} : 원문자
        * @param {string} : 비교 문자
        * @return {boolean} : 원문자열 중 비교할 문자열중의 단 1자라도 포함된 경우 -> true 반환 포함된 문자가 없으면 false 반환
        */
    isCompareStringOnly: function (pCompareString, pString) {
        var rtnValue = true;

        for (var cnti = 0; cnti < pString.length; cnti++) {
            var dmyString = pString.substring(cnti, cnti + 1);

            if (pCompareString.indexOf(dmyString) < 0) {
                rtnValue = false;
                break;
            }
        }
        return rtnValue;
    },
    /**
        * trim 함수 / 2010-12-17 이용훈
        * 
        * @param {string} : 원문자
        * @return {string} : 원문자열 중 왼쪽의 공백(스페이스)문자를 제외한 문자열 반환
        */
    trimLeft: function (A) {
        if (typeof (A) == 'string') {
            if (A.length > 0) {
                for (var cnti = 0; cnti < A.length; cnti++) {
                    if (A.substring(cnti, cnti + 1) == ' ') {
                        A = A.substring(cnti + 1, A.length);
                    } else {
                        break;
                    }
                }
            }
        }
        return A;
    },
    /**
        * trim 함수 / 2010-12-17 이용훈
        * 
        * @param {string} : 원문자
        * @return {string} : 원문자열 중 오른쪽의 공백(스페이스)문자를 제외한 문자열 반환
        */
    trimRight: function (A) {
        if (typeof (A) == 'string') {
            if (A.length > 0) {
                for (; ; ) {
                    if (A.substring(A.length - 1, A.length) == ' ') {
                        A = A.substring(0, A.length - 1);
                    } else {
                        break;
                    }
                }
            }
        }
        return A;
    },
    /**
        * trim 함수 / 2010-12-17 이용훈
        * 
        * @param {string} : 원문자
        * @return {string} : 원문자열 중 왼쪽과 오른쪽의 공백(스페이스)문자를 제외한 문자열 반환
        */
    trim: function (A) {
        A = azlib.string.trimLeft(A);
        A = azlib.string.trimRight(A);
        return A;
    },
    /**
        * html 태그를 변환	/ 2011-03-07 이용훈
        * 
        * @param {string} : 원문자
        * @return {string} : 입력받은 원문자 중 &, <, > 문자열에 대해 각각 &amp;, &lt;, &gt; 로 치환한 문자열 반환
        */
    replaceTag: function (A) {
        A = azlib.string.replaceAll(A, '&', '&amp;');
        A = azlib.string.replaceAll(A, '<', '&lt;');
        A = azlib.string.replaceAll(A, '>', '&gt;');
        return A;
    },
    /**
        * 랜덤 문자열을 반환		// 작성일 : 2011-09-30 이용훈
        * 
        * @param {string} : 생성할 랜덤 문자열 구분(number : 숫자로만 구성/string:문자로만 구성/mix:숫자,문자 혼합구성)
        * @param {int} : 생성할 랜덤 문자열 크기 지정
        * @return : 지정된 크기의 랜덤 문자열 반환
        */
    makeRandomString: function (pType, pSize) {
        var rtnValue = '';
        if (typeof (pSize) != 'number') {
            throw new Error('문자열크기 지정 인수값은 숫자형만 입력하셔야 합니다.');
            return;
        }
        if (pType == 'number') {
            for (var cnti = 0; cnti < pSize; cnti++) {
                var rndValue = Math.floor(Math.random() * 10);
                rtnValue += rndValue;
            }
        } else if (pType == 'string') {
            for (var cnti = 0; cnti < pSize; cnti++) {
                var rndValue = Math.floor(Math.random() * 57) + 65;
                if (Number(rndValue) > 90 && Number(rndValue) < 97) 
                    rndValue = 97
                rtnValue += String.fromCharCode(rndValue);
            }
        } else if (pType == 'mix') {
            for (var cnti = 0; cnti < pSize; cnti++) {
                var rndValue = Math.floor(Math.random() * 74) + 48;
                if (Number(rndValue) > 57 && Number(rndValue) < 65) 
                    rndValue = 65
                if (Number(rndValue) > 90 && Number(rndValue) < 97) 
                    rndValue = 97
                rtnValue += String.fromCharCode(rndValue);
            }
        } else {
            throw new Error('type 지정값에는 number, string, mix 값만 사용할 수 있습니다.');
        }
        return rtnValue;
    },
    toJSONSafeEncoding: function(A) {
        A = azlib.string.replaceAll(A, '\\', '\\\\');
        A = azlib.string.replaceAll(A, '"', '\\"');
        A = azlib.string.replaceAll(A, '\b', '\\b');
        A = azlib.string.replaceAll(A, '\f', '\\f');
        A = azlib.string.replaceAll(A, '\n', '\\n');
        A = azlib.string.replaceAll(A, '\r', '\\r');
        A = azlib.string.replaceAll(A, '\t', '\\t');
        return A;
    },
    toJSONSafeDecoding: function(A) {
        A = azlib.string.replaceAll(A, '\\t', '\t');
        A = azlib.string.replaceAll(A, '\\r', '\r');
        A = azlib.string.replaceAll(A, '\\n', '\n');
        A = azlib.string.replaceAll(A, '\\f', '\f');
        A = azlib.string.replaceAll(A, '\\b', '\b');
        A = azlib.string.replaceAll(A, '\\"', '"');
        A = azlib.string.replaceAll(A, '\\\\', '\\');
        return A;
    },
    getData: function(A) {
    	return azlib.string.toAZData(A);
    },
    toAZData: function(A) {
    	var rtnValue = new azlib.util.AZData();

    	var json_obj = null;
    	try { json_obj = JSON.parse(A); } catch (e) { new Error('json parsing error occured!!'); }

    	if (json_obj != null) {
			for (var name in json_obj) {
				rtnValue.add(name, json_obj[name]);
			}
		}
		return rtnValue;
    },
    getList: function(A) {
    	return azlib.string.toAZList(A);
    },
    toAZList: function(A) {
    	var rtnValue = new azlib.util.AZList();

    	var json_obj = null;
    	try { json_obj = JSON.parse(A); } catch (e) { new Error('json parsing error occured!!'); }

    	if (json_obj != null) {
			for (var cnti=0; cnti<json_obj.length; cnti++) {
				var json_data = json_obj[cnti];
				var data = new azlib.util.AZData();

				for (var name in json_data) {
					data.add(name, json_data[name]);
				}
				rtnValue.add(data);
			}
		}
		return rtnValue;
    }
};

//azlib.string.appendPrototype();

azlib.form = {
	/**
	 * azlib.form.create({id:'jFrm', input:[{type:'hidden', name:'arg1', value:'val1'}, {type:'hidden', name:'arg2', value:'val2'}]}).form.post({action:'/', type:'text', on_success:function(p_value) {alert('ok: ' + p_value);}, on_fail:function(pex) {alert('fail:' + p_ex.toString());}});
	 * 
	 */
	create: function(p_json) {
		var id = p_json.id;
		var method = p_json.method;
		var action = p_json.action;

		var input = p_json.input;

		var frm = azlib.create({tag:'form', id:id});

        if (!azlib.isNull(action)) { frm.action = action; }

		for (var cnti=0; cnti<input.length; cnti++) {
			var data = input[cnti];
			azlib.form.appendInput({form:frm, type:data.type, name:data.name, value:data.value});
		}

		return azlib.isNull(frm.is_azlib) ? azlib(frm) : frm;
	},
	appendInput: function(p_json) {
		var frm = p_json.form;
		var type = p_json.type;
		var name = p_json.name;
		var value = p_json.value;

		var input = azlib.create({tag:'input', id:name});
		input.setAttribute('type', type);
		if (type != 'file') { input.setAttribute('value', value); }

        frm.appendChild(input);
	},
	post: function(p_json) {
		var frm = p_json.form;
		var method = p_json.method;
		var action = p_json.action;
		var type = p_json.type;
		var on_success = p_json.on_success;
		var on_fail = p_json.on_fail;

		if (azlib.isNull(frm)) {
            throw new Error('대상 form 객체가 지정되지 않았습니다.');
            return;
		}
		if (typeof(frm) == 'string') { frm = azlib(frm); }
		if (frm.tagName.toLowerCase() != 'form') {
            throw new Error('대상 객체가 form 객체가 아닙니다.');
            return;
		}
        if (document.body == undefined || document.body == null) {
            throw new Error('BODY 객체가 지정되어야 합니다.');
            return;
        }

        if (!azlib.isNull(action)) { frm.action = action; }
        if (azlib.isNull(method)) { method = 'post'; }
        if (azlib.isNull(type)) { type = ''; }


        //
        var ifrmObjName = 'azlib_iframe_createnum_' + '{"type":"mix", "size":10}'.makeRandom();

        var $ifrm = azlib(ifrmObjName);
        if ($ifrm == undefined || $ifrm == null) {
        	$ifrm = azlib.create({tag:'iframe', id:ifrmObjName});

            $ifrm.style.width = '1px';
            $ifrm.style.height = '1px';
            azlib.append($ifrm);
            $ifrm.style.display = 'none';
        }

        frm.method = method;
        frm.target = ifrmObjName;

        try {
            //$ifrm.onload = function() {
            function doRemain() {
        		try {
	                if ($ifrm.contentWindow.document.readyState == 'complete') {
	                    var ifrmText = '';
	                    if (type == 'text') {
	                        // 반환객체를 일반 text형식으로 받을 경우
	                        ifrmText = $ifrm.contentWindow.document.body.innerHTML;
	                    } 
	                    else if (type == 'json') {
	                        // 반환객체를 일반 json형식으로 받을 경우
	                        try {
	                            ifrmText = $ifrm.contentWindow.document.body.innerText;
	                        } 
	                        catch (e) {
	                            ifrmText = $ifrm.contentWindow.document.body.innerHTML;
	                        }
	                        try {
	                            ifrmText = eval('(' + ifrmText + ')');
	                        } 
	                        catch (e) {
	                            //throw new Error('json형식으로 변환중 오류가 발생했습니다.');
					            if (!azlib.isNull(on_fail)) {
						            if (typeof (on_fail) == 'function') {
						                var func = on_fail;
						                func(e);
						            } else if (typeof (on_fail) == 'string') {
						                eval(on_fail + '(e);');
						            }
						        }
	                            return;
	                        }
	                    } else if (type == '') {}
	                    // 반환값을 처리하지 않을 경우

	                    if (typeof (on_success) == 'function') {
	                        var func = on_success;
	                        func(ifrmText);
	                    } 
	                    else if (typeof (on_success) == 'string') {
	                        eval(on_success + '(ifrmText);');
	                    }
	                    azlib.remove($ifrm);
	                    //document.body.removeChild($ifrm);
	                }
	            }
		        catch (e) {
		            //throw new Error('doPost 처리중 오류가 발생했습니다.');
		            if (!azlib.isNull(on_fail)) {
			            if (typeof (on_fail) == 'function') {
			                var func = on_fail;
			                func(e);
			            } else if (typeof (on_fail) == 'string') {
			                eval(on_fail + '(e);');
			            }
			        }
		            return;
		        }
            }

            if (type != 'none') {
                try {
                    $ifrm.addEventListener('load', doRemain, false);
                } 
                catch (e) {
                    $ifrm.attachEvent('onload', doRemain);
                }
            }
        } 
        catch (e) {
            //throw new Error('doPost 처리중 오류가 발생했습니다.');
            if (!azlib.isNull(on_fail)) {
	            if (typeof (on_fail) == 'function') {
	                var func = on_fail;
	                func(e);
	            } else if (typeof (on_fail) == 'string') {
	                eval(on_fail + '(e);');
	            }
	        }
            return;
        }
        frm.submit();
	}
}

azlib.graphic = {
	ANI_START_WIDTH: 'start_width',
	ANI_END_WIDTH: 'end_width',
	ANI_START_HEIGHT: 'start_height',
	ANI_END_HEIGHT: 'end_height',
	ANI_DURATION: 'duration',
	ANI_ON_SUCCESS: 'on_success', 
	ANI_ON_FAIL: 'on_fail', 
	Bounds: function() {
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;

		this.set = function(p_x, p_y, p_width, p_height) {
			this.x = p_x;
			this.y = p_y;
			this.width = p_width;
			this.height = p_height;
		};

		this.toString = function() {
			return 'x:' + this.x + ', y:' + this.y + ', width:' + this.width + ', height:' + this.height;
		}
	},
	/**
	 * alpha값 반환
	 * 작성일 : 2015-01-06 이용훈
	 */
	getAlpha: function(p_target) {
        var rtnValue = null;

        if (typeof (p_target) == 'string') { p_target = azlib(p_target); }

        try { rtnValue = p_target.style.MozOpacity; } catch (e) {}


        if (rtnValue == null || typeof (rtnValue) == 'undefined') {
            try {
                rtnValue = String(p_target.style.filter);
                rtnValue = rtnValue.replace('alpha(opacity=', '');
                rtnValue = rtnValue.replace(')', '');
            } catch (e) {}
        } 
        else {
            rtnValue = rtnValue * 100;
        }
        return rtnValue / 100;
	},
	/**
	 * alpha값 설정
	 * 작성일 : 2015-01-06 이용훈
	 */
	setAlpha: function(p_target, p_value) {
        if (typeof (p_target) == 'string') { p_target = azlib(p_target); }
        
        try {
            if (Number(p_value) >= 1.0) { p_value = 1.0; }
            if (Number(p_value) <= 0.0) { p_value = 0.0; }
            p_target.style.filter = 'alpha(opacity=' + (p_value * 100) + ')';
            p_target.style.MozOpacity = p_value;
            p_target.style.opacity = p_value;
        } catch (e) {}
        return p_value;
	},
	moveOnDrag: function(p_target) {
		var p_target = azlib(p_target);
		var evt_onselectstart = document.body.onselectstart;

		var pos_x, pos_y;

	    function init() {
		    if (p_target.style.position != 'absolute') { p_target.style.position = 'absolute'; }

		    var obj_bounds = p_target.getBounds();
		    pos_x = event.clientX - obj_bounds.x + 1;
		    pos_y = event.clientY - obj_bounds.y + 1;

		    try { event.preventDefault(); } catch (e) {} // 브라우저 기본동작 막기용

		    document.body.onselectstart = function () { return false; };
	    	document.onmousemove = move;
	    }

	    function move() {
	        p_target.style.pixelLeft = event.clientX - pos_x;
	        p_target.style.pixelTop = event.clientY - pos_y;
	        return false;
	    }
	    function release() {
	        pos_x = null;
	        pos_y = null;

	        document.onmousemove = null;
	        document.body.onselectstart = evt_onselectstart;
	    }

	    p_target.style.cursor = 'move';
	    document.onmousedown = init;
	    document.onmouseup = release;
	}
}

/**
 * azlib.util 하위 선언
 * date: create:2014-12-31 yonghun, lee
 */
 /*
azlib.util = {
	/**
	 * HashMap
	 * usage: var a = new azlib.util.HashMap(); / var a = azlib.util.HashMap.init();
	 * date: create:2014-12-31 yonghun, lee
	 *
	HashMap: function() {	
		var map = {};

		this.put = function(p_key, p_value) {
			var rtnValue = map[p_key];
			map[p_key] = p_value;
			return !azlib.isNull(rtnValue) ? rtnValue : null;
		};
		this.get = function(p_key) {
			return map[p_key];
		};
		this.remove = function(p_key) {
			var rtnValue = map[p_key];
			delete map[p_key];
			return !azlib.isNull(rtnValue) ? rtnValue : null;
		};
		this.containsKey = function(p_key) {
			return map[p_key] == undefined ? false : true;
		};
		this.size = function() {
			return map.length;
		};
		this.clear = function() {
			map = {};
		};
	},
    /**
        * 현재 브라우저의 모바일 여부 확인	// 작성일 : 2011-09-21 이용훈 from azfc
        * 
        * @return {boolean} : 해당 브라우저가 모바일 브라우저일 경우 true 반환/아니면 false
        *
    isMobile: function () {
        var rtnValue = false;
        var mobileStr = 'iPhone|iPad|Mobile|UP.Browser|Android|BlackBerry|Windows CE|Nokia|webOS|Opera Mini|SonyEricsson|opera mobi|Windows Phone|IEMobile|POLARIS';
        var mobileArrs = mobileStr.split('|');

        for (var cnti = 0; cnti < mobileArrs.length; cnti++) {
            if (String(navigator.appVersion).indexOf(mobileArrs[cnti]) > - 1) {
                rtnValue = true;
                break;
            }
        }
        return rtnValue;
    },
    isIOS: function () {
        var rtnValue = false;
        var mobileStr = 'iPhone|iPad';
        var mobileArrs = mobileStr.split('|');

        for (var cnti = 0; cnti < mobileArrs.length; cnti++) {
            if (String(navigator.appVersion).indexOf(mobileArrs[cnti]) > - 1) {
                rtnValue = true;
                break;
            }
        }
        return rtnValue;
    },
    isAndroid: function () {
        var rtnValue = false;
        var mobileStr = 'Android';
        var mobileArrs = mobileStr.split('|');

        for (var cnti = 0; cnti < mobileArrs.length; cnti++) {
            if (String(navigator.appVersion).indexOf(mobileArrs[cnti]) > - 1) {
                rtnValue = true;
                break;
            }
        }
        return rtnValue;
    }
}

azlib.util.HashMap.init = function() {
	return new azlib.util.HashMap();
}
*/

azlib.css3 = {
    support: null,
	CSS3_TYPE_TRANSITION_EASEINOUT: 'TRANSITION_EASEINOUT', //azlib.values.css3.string.transition.ease_in_out,
	CSS3_TYPE_SHADOW: 'SHADOW', //azlib.values.css3.string.shadow,
	CSS3_TYPE_BORDER_RADIUS: 'BORDER_RADIUS', //azlib.values.css3.string.border.radius,
	create: function(p_css3_type, p_class, p_json) {
		var obj = azlib.create({tag:'STYLE'});
		switch (p_css3_type) {
			case azlib.css3.CSS3_TYPE_TRANSITION_EASEINOUT:
				obj.innerHTML = '.' + p_class + ' { ' + azlib.css3.string.transition.ease_in_out.replaceAll('@sec@', p_json.sec) + '}' + ' ';
				break;
			case azlib.css3.CSS3_TYPE_SHADOW:
				obj.innerHTML = '.' + p_class + ' { ' + azlib.css3.string.shadow.replaceAll('@x@', p_json.x).replaceAll('@y@', p_json.y).replaceAll('@size@', p_json.size).replaceAll('@alpha@', p_json.alpha) + '}' + ' ';
				break;
			case azlib.css3.CSS3_TYPE_BORDER_RADIUS:
				obj.innerHTML = '.' + p_class + ' { ' + azlib.css3.string.border.radius.replaceAll('@size@', p_json.size) + '}' + ' ';
				break;
		}
		azlib.append(obj, !azlib.isNull(document.head) ? document.head : document.body);
	},
	isSupportCSS3: function () {
        var rtnValue = false;
        if (azlib.css3.support == null) {
            var transformValus = 'webkitTransform mozTransform oTransform transform'.split(' ');
            var transformDiv = document.createElement('div');
            for (var cnti = 0; cnti < transformValus.length; cnti++) {
                if (eval('transformDiv.style.' + transformValus[cnti]) == '') {
                    rtnValue = true;
                    break;
                }
            }
            azlib.css3.support = rtnValue;
        }
        return azlib.css3.support;
    },
    string: {
        transition: {
        	ease_in_out: '-webkit-transition: all @sec@s ease-in-out; -moz-transition: all @sec@s ease-in-out; -ms-transition: all @sec@s ease-in-out;  transition: all @sec@s ease-in-out; '
        },
        shadow: '-webkit-box-shadow: @x@px @y@px @size@px rgba(0, 0, 0, @alpha@); -moz-box-shadow: @x@px @y@px @size@px rgba(0, 0, 0, @alpha@); -ms-box-shadow: @x@px @y@px @size@px rgba(0, 0, 0, @alpha@); box-shadow: @x@px @y@px @size@px rgba(0, 0, 0, @alpha@);',
        border: {
        	radius: '-webkit-border-radius: @size@px; -moz-border-radius: @size@px; -ms-border-radius: @size@px; border-radius: @size@px;'
        }
    }
}

azlib.freeTransform = function(p_target) {
	p_target = azlib(p_target);

	var id_string = 'free_transform_#' + '{"size":20}'.makeRandom();
	var over_layer_obj = azlib.create({tag:'DIV', id:id_string}).append();

	//
	p_target.setAttribute('overlay_id', id_string);

	//over_layer_obj.css.set('position:absolute; border:1px dashed #ff0000; z-index:999;');
	over_layer_obj.css.set('position:absolute; z-index:999;');
	//over_layer_obj.style.position = p_target.style.position = 'absolute';
	var bounds = p_target.getBounds();
	//bounds.width -= 2;
	//bounds.height -= 2;
	over_layer_obj.setBounds(bounds);

	over_layer_obj.html('<table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0" style="border:1px dashed #ff0000;"><tr><td align="left" valign="top"><div id="' + id_string + '_move"></div></td></tr><tr><td align="right" valign="bottom"><div id="' + id_string + '_resize"></div></td></tr></table>');
	//over_layer_obj.setAlpha(0.4);

	var resize_obj = azlib(id_string + '_resize');
	resize_obj.css.set('width:20px; height:20px; border-width:2px 0 0 2px; border-color:#777777; border-style:solid; background-color:#000000; cursor:se-resize;');
	resize_obj.setAlpha(0.6);

	//
	var evt_onselectstart = document.body.onselectstart;
	var resize_init_x, resize_init_y, resize_init_width, resize_init_height;
	var move_init_x, move_init_y;

    function resize_init() {
	    //if (p_target.style.position != 'absolute') { p_target.style.position = 'absolute'; }

	    var obj_bounds = over_layer_obj.getBounds();
	    resize_init_x = event.clientX;// - obj_bounds.x + 1;
	    resize_init_y = event.clientY;// - obj_bounds.y + 1;
	    resize_init_width = obj_bounds.width;
	    resize_init_height = obj_bounds.height;

	    try { event.preventDefault(); } catch (e) {} // 브라우저 기본동작 막기용

	    document.body.onselectstart = function () { return false; };
    	document.onmousemove = resize_move;
    }

    function resize_move() {
        p_target.style.pixelWidth = over_layer_obj.style.pixelWidth = resize_init_width + (event.clientX - resize_init_x);
        p_target.style.pixelHeight = over_layer_obj.style.pixelHeight = resize_init_height + (event.clientY - resize_init_y);

        return false;
    }
    function resize_release() {
        resize_init_x = null;
        resize_init_y = null;
        resize_init_width = null;
        resize_init_height = null;

        document.onmousemove = null;
        document.body.onselectstart = evt_onselectstart;
    }

    //document.onmousedown = resize_init;
    resize_obj.onmouseup = document.onmouseup = resize_release;

	resize_obj.onmousedown = resize_init;



	var move_obj = azlib(id_string + '_move');
	move_obj.css.set('width:40px; height:40px; border-width:0 1px 1px 0; border-color:#444444; border-style:solid; background-color:#ffffff; cursor:move;');
	move_obj.setAlpha(0.6);
	//
    function move_init() {
	    if (p_target.style.position != 'absolute') { p_target.style.position = 'absolute'; }

	    var obj_bounds = over_layer_obj.getBounds();
	    move_init_x = event.clientX - obj_bounds.x + 1;
	    move_init_y = event.clientY - obj_bounds.y + 1;

	    try { event.preventDefault(); } catch (e) {} // 브라우저 기본동작 막기용

	    document.body.onselectstart = function () { return false; };
    	document.onmousemove = move_move;
    }

    function move_move() {
        p_target.style.pixelLeft = over_layer_obj.style.pixelLeft = event.clientX - move_init_x;
        p_target.style.pixelTop = over_layer_obj.style.pixelTop = event.clientY - move_init_y;

        return false;
    }
    function move_release() {
        move_init_x = null;
        move_init_y = null;

        document.onmousemove = null;
        document.body.onselectstart = evt_onselectstart;
    }

    //document.onmousedown = resize_init;
    move_obj.onmouseup = document.onmouseup = move_release;

	move_obj.onmousedown = move_init;




	//
	function hideOverlay() {
		if (azlib.isNull(event.target.is_azlib)) {
			over_layer_obj.hide();
		}
	}
	function showOverlay() {
		//alert('test:target:' + event.target + ' / ' + over_layer_obj + ' / ' + over_layer_obj.style.display);
		over_layer_obj.show();
		over_layer_obj.style.zIndex = 999;
	}
	document.body.onmousedown = hideOverlay;
	p_target.onmousedown = showOverlay;

	return p_target;
}





// code for node.js

azlib.text = {
	AZString: function(p_value) { this.value_object = p_value; }
}
azlib.text.AZString.prototype = {
	appendPrototype: function() {
		String.prototype.RANDOM_TYPE = {
			CHARACTER_ONLY: 'string',
			NUMBER_ONLY: 'number',
			CHARACTER_AND_NUMBER: 'mix'
		}

		String.prototype.toInt = function(p_default) {
			return azlib.text.AZString.init(this).toInt(p_default);
		};
		String.prototype.byteLength = function() {
			return azlib.text.AZString.init(this).byteLength();
		};
		String.prototype.random = function(p_length, p_source_string) {
			return azlib.text.AZString.init().random(p_length, this);
		};
		String.prototype.repeat = function(p_length) {
			return azlib.text.AZString.init(this).repeat(p_length);
		};
		String.prototype.format = function(p_input_format, p_output_format) {
			return azlib.text.AZString.init(this).format(p_input_format, p_output_format);
		};
		String.prototype.replaceAll = function(p_target, p_replace) {
			return azlib.text.AZString.init(this).replaceAll(p_target, p_replace);
		};
		String.prototype.reverse = function() {
			return azlib.text.AZString.init(this).reverse();
		};
		String.prototype.encode = function(p_encode) {
			return azlib.text.AZString.init(this).encode(p_encode);
		};
		String.prototype.decode = function(p_decode) {
			return azlib.text.AZString.init(this).decode(p_decode);
		};
		String.prototype.startsWith = function(p_value) {
			return (this.length > 0 && this.indexOf(p_value) == 0) ? true : false;
		};
		String.prototype.endsWith = function(p_value) {
			return (this.lastIndexOf(p_value) > -1 && this.length > 0 && this.lastIndexOf(p_value) == (this.length - p_value.length)) ? true : false;
		};
		String.prototype.toAZData = function() {
			return azlib.string.toAZData(this);
		};
		String.prototype.getData = function() {
			return azlib.string.toAZData(this);
		};
		String.prototype.toAZList = function() {
			return azlib.string.toAZList(this);
		};
		String.prototype.getList = function() {
			return azlib.string.toAZList(this);
		};
	},
	value_object: '',
	ENCODE: {
		SQL: 'SQL',
		XSS: 'XSS',
		JSON: 'JSON',
		HTML: 'HTML',
		XML: 'XML'
	},
	DECODE: {
		SQL: 'SQL',
		JSON: 'JSON',
		HTML: 'HTML'
	},
	RANDOM_TYPE: {
		ALPHABET_ONLY: 'ALPHABET_ONLY',
		NUMBER_ONLY: 'NUMBER_ONLY',
		ALPHABET_AND_NUMBER: 'ALPHABET_AND_NUMBER'
	},
	/*RANDOM_ALPHABET_ONLY: -101,
	RANDOM_NUMBER_ONLY: -102,
	RANDOM_ALPHABET_NUMBER: -103,*/
	toInt: function(p_default_value) { 
		var rtnValue = p_default_value == undefined ? 0 : p_default_value;
		if (!isNaN(this.value_object)) {
			rtnValue = Number(this.value_object);
		}
		return rtnValue; 
	},
	toString: function() { return this.value_object },
	/**
	 * Created in 2015-10-07, leeyonghun
	 */
    byteLength: function () {
		var source = this.value_object;
        var rtnValue = 0;

        for (var i = 0; i < source.length; i++) {
            if (escape(source.charAt(i)).length >= 4) {
                rtnValue += 2;
            } else {
                if (escape(source.charAt(i)) != "%0D")
                ++rtnValue;
            }
        }
        return rtnValue;
    },
	/**
	 * Created in 2015-10-07, leeyonghun
	 */
	random: function(p_length, p_source_string) {
		var rtn_value = '';
		var length = p_length == undefined ? 6 : p_length;
		var source_string = 
			p_source_string == undefined ? 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
				: p_source_string;
		
		for (var cnti=0; cnti<length; cnti++) {
			var rnd = Math.ceil(Math.random() * (source_string.length)) - 1;
			rtn_value += source_string.charAt(rnd);
		}
		return rtn_value;
	},
	/**
	 * Created in 2015-10-07, leeyonghun
	 */
	repeat: function(p_length) {
		var rtn_value = '';
		for (var cnti=0; cnti<p_length; cnti++) {
			rtn_value += this.value_object;
		}
		return rtn_value;
	},
	/**
	 * Created in 2015-10-07, leeyonghun
	 */
	format: function(p_input_format, p_output_format) {
		var A = this.toString();
		var B = p_input_format;
		var C = p_output_format;
        var rtnValue = C;
        if (typeof (B) != 'string' || typeof (C) != 'string') {
            throw new Error('모든 인수는 문자열 형태여야 합니다.');
            return null;
        }
        if (A.length != B.length) {
            throw new Error('1번째와 2번째 인수의 문자열 길이가 동일해야 합니다.');
            return null;
        }
        /*for (var cnti = 0; cnti < B.length; cnti++) {
            var x = B.substring(cnti, cnti + 1);
            if (('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz').indexOf(x) < 0) {
                throw new Error('2번째 인수로는 A~Z, a~z까지의 영문자만 사용가능 합니다.');
                return null;
            }
        }*/

        var $arr = new Array();
        var formatData = function (pCharacter, pString, pValue) {
            this.character = pCharacter;
            this.string = pString;
            this.value = pValue;
        }
        var prevCharacter = '';
        var prevString = '';
        var prevStartIdx = 0;
        var prevEndIdx = 0;
        var arrIdx = 0;
        for (var cnti = 0; cnti < (B + '|').length; cnti++) {
            var x = (B + '|').substring(cnti, cnti + 1);

            if (prevCharacter != x) {
                if (cnti > 0) {
                    $arr[arrIdx] = new formatData(prevCharacter, prevString, A.substring(prevStartIdx, prevEndIdx + 1));
                    ++arrIdx;
                }
                prevStartIdx = cnti;
                prevCharacter = x;
                prevString = x;
                prevEndIdx = cnti;
            } else {
                prevString += x;
                prevEndIdx = cnti;
            }
        }

        for (var cnti = 0; cnti < $arr.length; cnti++) {
            rtnValue = azlib.string.replaceAll(rtnValue, $arr[cnti].string, $arr[cnti].value);
        }

        return rtnValue;
	},
	/**
	 * Created in 2015-10-07, leeyonghun
	 */
	replaceAll: function(p_source_string, p_replace_string) {
        var rtnValue = '';
        var remainStr = this.value_object;
        while (remainStr.indexOf(p_source_string) != - 1) {
            var replaceStr = remainStr.substring(remainStr.indexOf(p_source_string), remainStr.indexOf(p_source_string) + p_source_string.length);
            rtnValue += remainStr.substring(0, remainStr.indexOf(p_source_string)) + p_replace_string;
            remainStr = remainStr.substring(remainStr.indexOf(p_source_string) + p_source_string.length, remainStr.length);
        }
        rtnValue += remainStr;

        return rtnValue;
	},
	/**
	 * Created in 2015-10-07, leeyonghun
	 */
    reverse: function() {
        var totCnt;
		var source = this.value_object;
        var rtnValue = '';

        totCnt = Number(source.length);

        for (var cnti = 0; cnti < totCnt; cnti++) {
            var dmy = source.substring(source.length - cnti - 1, source.length - cnti);
            rtnValue += dmy;
        }
        totCnt = null;

        return rtnValue;
    },
	/**
	 * Created in 2015-10-07, leeyonghun
	 */
	encode: function(p_encode) {
		var rtn_value = this.value_object;
		switch (p_encode) {
			case "SQL":
				rtn_value = rtn_value.replaceAll('&nbsp;', '&nbsp');
				rtn_value = rtn_value.replaceAll('#', '&#35;');
				rtn_value = rtn_value.replaceAll(';', '&#59;');
				rtn_value = rtn_value.replaceAll('\'', '&#39;');
				rtn_value = rtn_value.replaceAll('--', '&#45;&#45;');
				rtn_value = rtn_value.replaceAll('\\', '&#92;');
				rtn_value = rtn_value.replaceAll('*', '&#42;');
				rtn_value = rtn_value.replaceAll('&nbsp', '&nbsp;');
				break;
			case "JSON":
				rtn_value = rtn_value.replaceAll('\\', '\\\\');
				rtn_value = rtn_value.replaceAll('"', '\\"');
				rtn_value = rtn_value.replaceAll('\b', '\\b');
				rtn_value = rtn_value.replaceAll('\f', '\\f');
				rtn_value = rtn_value.replaceAll('\n', '\\n');
				rtn_value = rtn_value.replaceAll('\r', '\\r');
				rtn_value = rtn_value.replaceAll('\t', '\\t');
				break;
		}
		return rtn_value;
	},
	/**
	 * Created in 2015-10-07, leeyonghun
	 */
	decode: function(p_decode) {
		var rtn_value = this.value_object;
		switch (p_decode) {
			case "SQL":
				rtn_value = rtn_value.replaceAll('&nbsp;', '&nbsp');
				rtn_value = rtn_value.replaceAll('&#42;', '*');
				rtn_value = rtn_value.replaceAll('&#92;', '\\');
				rtn_value = rtn_value.replaceAll('&#45;&#45;', '--');
				rtn_value = rtn_value.replaceAll('&#39;', '\'');
				rtn_value = rtn_value.replaceAll('&#35;', '#');
				rtn_value = rtn_value.replaceAll('&#59;', ';');
				rtn_value = rtn_value.replaceAll('&#35;', '#');
				rtn_value = rtn_value.replaceAll('&nbsp', '&nbsp;');
				break;
			case "JSON":
				rtn_value = rtn_value.replaceAll('\\t', '\t');
				rtn_value = rtn_value.replaceAll('\\r', '\r');
				rtn_value = rtn_value.replaceAll('\\n', '\n');
				rtn_value = rtn_value.replaceAll('\\f', '\f');
				rtn_value = rtn_value.replaceAll('\\b', '\b');
				rtn_value = rtn_value.replaceAll('\\"', '"');
				rtn_value = rtn_value.replaceAll('\\\\', '\\');
				break;
		}
		return rtn_value;
	},
    toAZData: function() {
    	var rtnValue = new azlib.util.AZData();

    	var json_obj = null;
    	try { json_obj = JSON.parse(this.value_object); } catch (e) { new Error('json parsing error occured!!'); }

    	if (json_obj != null) {
			for (var name in json_obj) {
				rtnValue.add(name, json_obj[name]);
			}
		}
		return rtnValue;
    },
    toAZList: function() {
    	var rtnValue = new azlib.util.AZList();

    	var json_obj = null;
    	try { json_obj = JSON.parse(this.value_object); } catch (e) { new Error('json parsing error occured!!'); }

    	if (json_obj != null) {
			for (var cnti=0; cnti<json_obj.length; cnti++) {
				var json_data = json_obj[cnti];
				var data = new azlib.util.AZData();

				for (var name in json_data) {
					data.add(name, json_data[name]);
				}
				rtnValue.add(data);
			}
		}
		return rtnValue;
    }
}
azlib.text.AZString.init = function(p_value) { return new azlib.text.AZString(p_value); }
azlib.text.AZString.init().appendPrototype();

/**
 * 
 * 
 */
azlib.util = {
    /**
        * 현재 브라우저의 모바일 여부 확인	// 작성일 : 2011-09-21 이용훈 from azfc
        * 
        * @return {boolean} : 해당 브라우저가 모바일 브라우저일 경우 true 반환/아니면 false
        */
    isMobile: function () {
        var rtnValue = false;
        var mobileStr = 'iPhone|iPad|Mobile|UP.Browser|Android|BlackBerry|Windows CE|Nokia|webOS|Opera Mini|SonyEricsson|opera mobi|Windows Phone|IEMobile|POLARIS';
        var mobileArrs = mobileStr.split('|');

        for (var cnti = 0; cnti < mobileArrs.length; cnti++) {
            if (String(navigator.appVersion).indexOf(mobileArrs[cnti]) > - 1) {
                rtnValue = true;
                break;
            }
        }
        return rtnValue;
    },
    isIOS: function () {
        var rtnValue = false;
        var mobileStr = 'iPhone|iPad';
        var mobileArrs = mobileStr.split('|');

        for (var cnti = 0; cnti < mobileArrs.length; cnti++) {
            if (String(navigator.appVersion).indexOf(mobileArrs[cnti]) > - 1) {
                rtnValue = true;
                break;
            }
        }
        return rtnValue;
    },
    isAndroid: function () {
        var rtnValue = false;
        var mobileStr = 'Android';
        var mobileArrs = mobileStr.split('|');

        for (var cnti = 0; cnti < mobileArrs.length; cnti++) {
            if (String(navigator.appVersion).indexOf(mobileArrs[cnti]) > - 1) {
                rtnValue = true;
                break;
            }
        }
        return rtnValue;
    },
	AZHashMap: function() {
		this.map = [];
	},
	AZData: function() {
		this.map_async = new azlib.util.AZHashMap();
		this.map_attribute = new azlib.util.AZHashMap();
		this.indexer = new Array();
	},
	AZList: function() {
		this.list = new Array();
		this.map_attribute = new azlib.util.AZHashMap();
	},
	AZSql: function(p_json) {
		if (typeof(p_json) == 'string') {
			var json = JSON.parse(p_json);
			
			this.set(json);			
			/*this.sql_type = json.sql_type;
			this.server = json.server;
			this.port = json.port;
			this.catalog = json.catalog;
			this.id = json.id;
			this.pw = json.pw;
			this.connection_string = json.connection_string != undefined ? json.connection_string : '';*/
		}
		else {
			this.sql_type = p_json.sql_type;
			this.server = p_json.server;
			this.port = p_json.port;
			this.catalog = p_json.catalog;
			this.id = p_json.id;
			this.pw = p_json.pw;
			this.connection_string = p_json.connection_string != undefined ? p_json.connection_string : '';
		}
	}
}

azlib.util.AZHashMap.prototype = {
	map: null,
	put: function(p_key, p_value) {
		this.map[p_key] = p_value;
		return p_value;
	},
	get: function(p_key) {
		var rtnValue = null;
		if (this.map[p_key] != undefined) {
			rtnValue = this.map[p_key];
		}
		return rtnValue;
	},
	remove: function(p_key) {
		var rtnValue = null;
		if (get(p_key) != null) {
			rtnValue = get(p_key);
		}
		this.map[p_key] = undefined;
		return rtnValue;
	},
	clear: function() {
		this.map = [];
	},
	size: function() {
		return this.map.length;
	}
}

azlib.util.AZData.KeyLink = function(p_key, p_link) {
	this.key = p_key;
	this.link = p_link;
}
azlib.util.AZData.KeyLink.prototype = {
	key: '', 
	link: '', 
	getKey: function() {
		return this.key == undefined ? null : this.key;
	},
	getLink: function() {
		return this.link == undefined ? null : this.link;
	},
	toString: function() {
		return this.getKey() + ':' + this.getLink();
	}
}

azlib.util.AZData.prototype = {
	map_async: null,
	map_attribute: null,
	indexer: null,
	getAttribute: function(p_key) {
		return this.map_attribute.get(p_key);
	},
	putAttribute: function(p_key, p_value) {
		return this.map_attribute.put(p_key, p_value);
	},
	removeAttribute: function(p_key) {
		return this.map_attribute.remove(p_key);
	},
	clearAttribute: function() {
		var rtnValue = this.map_attribute.size();
		this.map_attribute.clear();
		return rtnValue;
	},
	add: function(p_key, p_value) {
		if (this.map_async.get(p_key) != null) {
			var linkString = azlib.text.AZString.init().getRandom();
			this.map_async.put(linkString, p_value);
			this.indexer.push(new azlib.util.AZData.KeyLink(p_key, linkString));
		}
		else {
			this.map_async.put(p_key, p_value);
			var keyLink = new azlib.util.AZData.KeyLink(p_key, p_key);
			this.indexer.push(new azlib.util.AZData.KeyLink(p_key, p_key));
		}
	},
	get: function(p_key) {
		if (typeof(p_key) == 'number') {
			return this.map_async.get(this.indexer[p_key].getLink());
		}
		else {
			return this.map_async.get(p_key);
		}
	},
	getString: function(p_key) {
		return String(this.get(p_key));
	},
	getInt: function(p_key, p_default_value) {
		var rtnValue = p_default_value != undefined ? p_default_value : 0;
		var value = this.get(p_key);
		if (!isNaN(value)) {
			rtnValue = Number(value);
		}
		return rtnValue;
	},
	getKey: function(p_index) {
		return this.indexer[p_index].getKey();
	},
	getLink: function(p_index) {
		return this.indexer[p_index].getLink();
	},
	size: function() {
		return this.indexer.length;
	},
	toString: function() {
		var rtnValue = '';
		for (var cnti=0; cnti<this.indexer.length; cnti++) {
			if (this.get(cnti) instanceof azlib.util.AZData) {
				rtnValue += (cnti > 0 ? ', ' : '') + '"' + this.getKey(cnti) + '"' + ':' + 
					this.get(cnti).toString();
			}
			else if (this.get(cnti) instanceof azlib.util.AZList) {
				rtnValue += (cnti > 0 ? ', ' : '') + '"' + this.getKey(cnti) + '"' + ':' + 
					this.get(cnti).toString();
			}
			else {
				var value_object = this.getString(cnti);
				rtnValue += (cnti > 0 ? ', ' : '') + '"' + this.getKey(cnti) + '"' + ':' + 
					'"' + value_object + '"';
			}
		}
		return rtnValue;
	},
	toJsonString: function() {
		var rtnValue = '';
		for (var cnti=0; cnti<this.indexer.length; cnti++) {
			if (this.get(cnti) instanceof azlib.util.AZData) {
				rtnValue += (cnti > 0 ? ', ' : '') + '"' + this.getKey(cnti).toJSONSafeEncoding() + '"' + ':' + 
					this.get(cnti).toJsonString();
			}
			else if (this.get(cnti) instanceof azlib.util.AZList) {
				rtnValue += (cnti > 0 ? ', ' : '') + '"' + this.getKey(cnti).toJSONSafeEncoding() + '"' + ':' + 
					this.get(cnti).toJsonString();
			}
			else {
				var value_object = this.getString(cnti);
				rtnValue += (cnti > 0 ? ', ' : '') + '"' + this.getKey(cnti).toJSONSafeEncoding() + '"' + ':' + 
					'"' + value_object.toJSONSafeEncoding() + '"';
			}
		}
		return '{' + rtnValue + '}';
	}
}

azlib.util.AZList.prototype = {
	list: null,
	map_attribute: null,
	getAttribute: function(p_key) {
		return this.map_attribute.get(p_key);
	},
	putAttribute: function(p_key, p_value) {
		return this.map_attribute.put(p_key, p_value);
	},
	removeAttribute: function(p_key) {
		return this.map_attribute.remove(p_key);
	},
	clearAttribute: function() {
		var rtnValue = this.map_attribute.size();
		this.map_attribute.clear();
		return rtnValue;
	},
	add: function(p_data) {
		this.list.push(p_data);
	},
	remove: function(p_index) {
		return this.list.splice(p_index, 1);
	},
	clear: function() {
		this.list = new Array();
	},
	size: function() {
		return this.list.length;
	},
	get: function(p_index) {
		return this.list[p_index];
	},
	getData: function(p_index) {
		return (AZData)(this.list(p_index));
	},
	toString: function() {
		var rtnValue = '';
		for (var cnti=0; cnti<this.size(); cnti++) {
			var data = this.get(cnti);
			rtnValue += (cnti > 0 ? ', ' : '') + '{' + data.toString() + '}';
		}
		return rtnValue;
	},
	toJsonString: function() {
		var rtnValue = '';
		for (var cnti=0; cnti<this.size(); cnti++) {
			var data = this.get(cnti);
			rtnValue += (cnti > 0 ? ', ' : '') + data.toJsonString();
		}
		return rtnValue;
		return '[' + rtnValue + ']';
	}
}

/*azlib.util.AZSql.SQL_TYPE_MYSQL = 'mysql';
azlib.util.AZSql.SQL_TYPE_SQLITE = 'sqlite';
azlib.util.AZSql.SQL_TYPE_MSSQL = 'mssql';
azlib.util.AZSql.SQL_TYPE_MARIADB = 'mariadb';
azlib.util.AZSql.SQL_TYPE_ORACLE = 'oracle';*/

/*azlib.util.AZSql.ATTRIBUTE_COLUMN_LABEL = 'attribute_column_label';
azlib.util.AZSql.ATTRIBUTE_COLUMN_NAME = 'attribute_column_name';
azlib.util.AZSql.ATTRIBUTE_COLUMN_TYPE = 'attribute_column_type';
azlib.util.AZSql.ATTRIBUTE_COLUMN_TYPE_NAME = 'attribute_column_type_name';
azlib.util.AZSql.ATTRIBUTE_COLUMN_SCHEMA_NAME = 'attribute_column_schema_name';
azlib.util.AZSql.ATTRIBUTE_COLUMN_DISPLAY_SIZE = 'attribute_column_display_size';
azlib.util.AZSql.ATTRIBUTE_COLUMN_SCALE = 'attribute_column_scale';
azlib.util.AZSql.ATTRIBUTE_COLUMN_PRECISION = 'attribute_column_precision';
azlib.util.AZSql.ATTRIBUTE_COLUMN_IS_AUTO_INCREMENT = 'attribute_column_auto_increment';
azlib.util.AZSql.ATTRIBUTE_COLUMN_IS_CASE_SENSITIVE = 'attribute_column_case_sensitive';
azlib.util.AZSql.ATTRIBUTE_COLUMN_IS_NULLABLE = 'attribute_column_is_nullable';
azlib.util.AZSql.ATTRIBUTE_COLUMN_IS_READONLY = 'attribute_column_is_readonly';
azlib.util.AZSql.ATTRIBUTE_COLUMN_IS_WRITABLE = 'attribute_column_is_writable';
azlib.util.AZSql.ATTRIBUTE_COLUMN_IS_SIGNED = 'attribute_column_is_signed';*/

azlib.util.AZSql.SQL_TYPE = {
	MYSQL: 'MYSQL', 
	MSSQL_2000: 'MSSQL_2000', 
	SQLITE: 'SQLITE', 
	SQLITE_ANDROID: 'SQLITE_ANDROID', 
	MSSQL: 'MSSQL', 
	MARIADB: 'MARIADB', 
	ORACLE: 'ORACLE'
}

azlib.util.AZSql.ATTRIBUTE_COLUMN = {
	LABEL: 'attribute_column_label',
	NAME: 'attribute_column_name',
	TYPE: 'attribute_column_type',
	TYPE_NAME: 'attribute_column_type_name', 
	SCHEMA_NAME: 'attribute_column_schema_name',
	DISPLAY_SIZE: 'attribute_column_display_size',
	SCALE: 'attribute_column_scale',
	PRECISION: 'attribute_column_precision',
	AUTO_INCREMENT: 'attribute_column_auto_increment',
	CASE_SENSITIVE: 'attribute_column_case_sensitive',
	IS_NULLABLE: 'attribute_column_is_nullable',
	IS_READONLY: 'attribute_column_is_readonly',
	IS_WRITABLE: 'attribute_column_is_writable',
	IS_SIGNED: 'attribute_column_is_signed'
}

//"{sql_type:mysql, server:127.0.0.1, port:3306, id:user, pw:password, catalog:database}"
azlib.util.AZSql.init = function(p_json_string) { return new azlib.util.AZSql(p_json_string); }
azlib.util.AZSql.prototype = {
	sql_type: '', 
	connection_string: '', 	// mysql://user:pass@host/db?debug=true&charset=BIG5_CHINESE_CI&timezone=-0700
	server: '',
	port: '', 
	catalog: '', 
	id: '', 
	pw: '',
	connected: false,
	connection: null, 
	set: function(p_json) {
		if (p_json.sql_type.length < 1) {
			new Error('sql_type not exist.');
		}

		this.sql_type = p_json.sql_type;

		if (p_json.connection_string && p_json.connection_string.length > 0) {
			this.connection_string = p_json.connection_string;
		}
		else {
			if (p_json.server.length < 1 || p_json.port < 0 || p_json.id.Length < 1 ||
					p_json.pw.Length < 1 || p_json.catalog.Length < 1) {
				new Error('parameters not exist.');
			}

			this.server = p_json.server;
			this.port = p_json.port;
			this.id = p_json.id;
			this.pw = p_json.pw;
			this.catalog = p_json.catalog;

			switch (this.sql_type) {
				case azlib.util.AZSql.SQL_TYPE.MYSQL:
					this.connection_string = 'mysql://' + this.id + ':' + this.pw + '@' + 
						this.server + ':' + this.port + '/' + this.catalog;
					break;
				case azlib.util.AZSql.SQL_TYPE.SQLITE:
					break;
				case azlib.util.AZSql.SQL_TYPE.SQLITE_ANDROID:
					break;
				case azlib.util.AZSql.SQL_TYPE.MSSQL_2000:
					this.connection_string  = {
						userName: this.id,
						password: this.pw,
						server: this.server,
						options: {
							database: this.catalog,
							port: this.port,
							driver: 'SQL Server Native Client 11.0',
							tdsVersion: '7_1' // sqlserver2000 접속용 옵션값
						},
						debug: {packet: true, data: true, payload: true, token: true, log: true}
					};
					break;
				case azlib.util.AZSql.SQL_TYPE.MSSQL:
					this.connection_string  = {
						userName: this.id,
						password: this.pw,
						server: this.server,
						options: {
							database: this.catalog,
							port: this.port,
							driver: 'SQL Server Native Client 11.0',
							//tdsVersion: '7_1' // sqlserver2000 접속용 옵션값
						},
						debug: {packet: true, data: true, payload: true, token: true, log: true}
					};
					break;
				case azlib.util.AZSql.SQL_TYPE.MARIADB:
					break;
				case azlib.util.AZSql.SQL_TYPE.ORACLE:
					break;
			}
		}

		return this;
	},
	open: function(p_func) {
		if (this.connected) {
			return;
		}
		var sql = null;

		if (this.sql_type == azlib.util.AZSql.SQL_TYPE.MYSQL) {
			sql = require('MYSQL');
			if (this.connection_string != '') {
				this.connection = sql.createConnection(this.connection_string);
			}
			else {
				this.connection = sql.createConnection(
				    {
					    host: this.server,
					    port: this.port,
					    user: this.id,
					    password: this.pw,
					    database: this.catalog
					}
				);
			}
			this.connection.connect(
				function (p_err) {
					if (p_err) {
						throw new Error('Error in AZSql.open : ' + p_err);
						return;
					}
					//p_func();
				}
			);
			this.connected = true;
		}
		else if (this.sql_type == azlib.util.AZSql.SQL_TYPE.MSSQL_2000) {
			sql = require('tedious').Connection;
			this.connection = new sql(this.connection_string);
		}
	},
	close: function() {
		if (this.connected) {
			this.connection.end();
		}
		this.connected = false;
	},
	execute: function(p_json) {	//p_query, p_func
		if (!p_json.query) {
			throw new Error('query not exist!');
			return;
		}

		if (!p_json.success) {
			throw new Error('callback(success) not exist!');
			return;
		}

		this.open();
		
		switch (this.sql_type) {
			case "MYSQL":
				this.connection.query(p_json.query, 
					function(p_err, p_rows, p_fields) {
						if (p_err) {
							if (p_json.failure) {
								p_json.failure(p_err);
								return;
							}
						}
						p_json.success({result: p_rows, fields: p_fields, error: p_err});
					}
				);
				break;
			case "MSSQL_2000":
				var $con = this.connection;
				this.connection.on('connect', 
					function(err) {
						var rtnValue = '';
								
						this.connected = true;
						var Request = require('tedious').Request;
						var request = new Request(p_json.query, 
							function(p_err, rowCount) {
								if (p_err) { p_json.failure(p_err); }
      							$con.close();
								return;
							}
						);
						request.on('done', 
							function(rowCount, more) {
								p_json.success({result: rowCount, more: more});
							}
						);
						$con.execSqlBatch(request);
					}
				);
				break;
		}


		this.close();
	},
	getString: function(p_json) {
		if (!p_json.query) {
			throw new Error('query not exist!');
			return;
		}

		if (!p_json.success) {
			throw new Error('callback(success) not exist!');
			return;
		}

		this.open();

		switch (this.sql_type) {
			case "MYSQL":
				this.connection.query(p_json.query, 
					function(p_err, p_rows, p_fields) {
						var rtnValue = '';
		
						if (p_err) {
							if (p_json.failure) {
								p_json.failure(p_err);
								return;
							}
						}
		
						if (p_rows.length > 0) {
							for (var name in p_rows[0]) {
								if (p_rows[0][name]) {
									rtnValue = p_rows[0][name];
									break;
								}
							}
						}
						rtnValue = String(rtnValue);
						p_json.success(rtnValue);
					}
				);
				break;
			case "MSSQL_2000":
				var $con = this.connection;
				this.connection.on('connect', 
					function(err) {
						var rtnValue = '';
								
						this.connected = true;
						var Request = require('tedious').Request;
						var request = new Request(p_json.query, 
							function(p_err, rowCount) {
								if (p_err) { p_json.failure(p_err); }
      							$con.close();
								return;
							}
						);
						request.on('row',
							function(p_rows) {
								if (p_rows.length > 0) { rtnValue = p_rows[0]['value']; }
							} 
						);
						request.on('done', 
							function(rowCount, more) {
								p_json.success(rtnValue);
							}
						);
						$con.execSqlBatch(request);
					}
				);
				break;
		}

		this.close();
	},
	getInt: function(p_json) {
		if (!p_json.query) {
			throw new Error('query not exist!');
			return;
		}

		if (!p_json.success) {
			throw new Error('callback(success) not exist!');
			return;
		}

		this.open();

		switch (this.sql_type) {
			case "MYSQL":
				this.connection.query(p_json.query, 
					function(p_err, p_rows, p_fields) {
						var rtnValue = '';
		
						if (p_err) {
							if (p_json.failure) {
								p_json.failure(p_err);
								return;
							}
						}
		
						if (p_rows.length > 0) {
							for (var name in p_rows[0]) {
								if (p_rows[0][name]) {
									rtnValue = p_rows[0][name];
									break;
								}
							}
						}
						rtnValue = String(rtnValue).toInt(p_json.default ? p_json.default : 0);
						p_json.success(rtnValue);
					}
				);
				break;
			case "MSSQL_2000":
				var $con = this.connection;
				this.connection.on('connect', 
					function(err) {
						var rtnValue = '';
								
						this.connected = true;
						var Request = require('tedious').Request;
						var request = new Request(p_json.query, 
							function(p_err, rowCount) {
								if (p_err) { p_json.failure(p_err); }
      							$con.close();
								return;
							}
						);
						request.on('row',
							function(p_rows) {
								if (p_rows.length > 0) { rtnValue = p_rows[0]['value']; }
								rtnValue = String(rtnValue).toInt(p_json.default ? p_json.default : 0);
							} 
						);
						request.on('done', 
							function(rowCount, more) {
								p_json.success(rtnValue);
							}
						);
						$con.execSqlBatch(request);
					}
				);
				break;
		}

		this.close();
	},
	getData: function(p_json) {
		if (!p_json.query) {
			throw new Error('query not exist!');
			return;
		}

		if (!p_json.success) {
			throw new Error('callback(success) not exist!');
			return;
		}

		this.open();
		
		switch (this.sql_type) {
			case "MYSQL":
				this.connection.query(p_json.query, 
					function(p_err, p_rows, p_fields) {
						var rtnValue = null;
		
						if (p_err) {
							if (p_json.failure) {
								p_json.failure(p_err);
								return;
							}
						}
		
						rtnValue = new azlib.util.AZData();
						if (p_rows.length > 0) {
							var row = p_rows[0];
		
							var arrs = new Array();
							for (var name in row) {
								if (row[name]) {
									arrs.push(row[name]);
								}
							}
		
							for (var cnti=0; cnti<p_fields.length; cnti++) {
								rtnValue.add(p_fields[cnti].name, arrs[cnti]);
							}
						}
						p_json.success({result: rtnValue, error: p_err});
					}
				);
				break;
			case "MSSQL_2000":
				var $con = this.connection;
				this.connection.on('connect', 
					function(err) {
						var rtnValue = new azlib.util.AZData();
								
						this.connected = true;
						var Request = require('tedious').Request;
						var request = new Request(p_json.query, 
							function(p_err, rowCount) {
								if (p_err) { p_json.failure(p_err); }
      							$con.close();
								return;
							}
						);
						request.on('row',
							function(p_rows) {
								//console.log('test:' + JSON.stringify(p_rows));
								for (var cnti=0; cnti<p_rows.length; cnti++) {
									rtnValue.add(p_rows[cnti]["metadata"]["colName"], p_rows[cnti]["value"]);
								}
							} 
						);
						request.on('done', 
							function(rowCount, more) {
								p_json.success(rtnValue);
							}
						);
						$con.execSqlBatch(request);
					}
				);
				break;
		}


		this.close();
	},
	getList: function(p_json) {
		if (!p_json.query) {
			throw new Error('query not exist!');
			return;
		}

		if (!p_json.success) {
			throw new Error('callback(success) not exist!');
			return;
		}

		this.open();
		
		switch (this.sql_type) {
			case "MYSQL":
				this.connection.query(p_json.query, 
					function(p_err, p_rows, p_fields) {
						var rtnValue = null;
		
						if (p_err) {
							if (p_json.failure) {
								p_json.failure(p_err);
								return;
							}
						}
		
						rtnValue = new azlib.util.AZList();
						if (p_rows.length > 0) {
		
							for (var cnti=0; cnti<p_rows.length; cnti++) {
								var row = p_rows[cnti];
								var data = new azlib.util.AZData();
		
								var arrs = new Array();
								for (var name in row) {
									if (row[name]) {
										arrs.push(row[name]);
									}
								}
		
								for (var cntk=0; cntk<p_fields.length; cntk++) {
									data.add(p_fields[cntk].name, arrs[cntk]);
								}
		
								rtnValue.add(data);
							}
						}
						p_json.success({result: rtnValue, error: p_err});
					}
				);
				break;
			case "MSSQL_2000":
				var $con = this.connection;
				this.connection.on('connect', 
					function(err) {
						var rtnValues = new azlib.util.AZList();
						
						this.connected = true;
						var Request = require('tedious').Request;
						var request = new Request(p_json.query, 
							function(p_err, rowCount) {
								if (p_err) { p_json.failure(p_err); }
      							$con.close();
								return;
							}
						);
						request.on('row',
							function(p_rows) {
								var rtnValue = new azlib.util.AZData();
								for (var cnti=0; cnti<p_rows.length; cnti++) {
									rtnValue.add(p_rows[cnti]["metadata"]["colName"], p_rows[cnti]["value"]);
								}
								rtnValues.add(rtnValue);
							} 
						);
						request.on('done', 
							function(rowCount, more) {
								p_json.success(rtnValues);
							}
						);
						$con.execSqlBatch(request);
					}
				);
				break;
		}


		this.close();
	}
}

try { exports.node = azlib; } catch (e) { };	// code for node.js end!!!

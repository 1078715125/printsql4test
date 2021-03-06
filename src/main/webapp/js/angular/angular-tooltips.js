/*
 * angular-tooltips 1.0.9
 * 
 * Angular.js tooltips module. http://720kb.github.io/angular-tooltips
 * 
 * MIT license Wed Apr 13 2016
 */
!function(t, o) {
	"use strict";
	var e = "tooltips", i = function() {
		var t = [], e = 0, i = function(i) {
			i - e >= 15 ? (t.forEach(function(t) {
						t()
					}), e = i) : o.console.log("Skipped!")
		}, r = function() {
			o.requestAnimationFrame(i)
		}, l = function(o) {
			o && t.push(o)
		};
		return {
			add : function(e) {
				t.length || o.addEventListener("resize", r), l(e)
			}
		}
	}(), r = function(t) {
		var o = {};
		return t.removeAttr(e), void 0 !== t.attr("tooltip-template")
				&& (o["tooltip-template"] = t.attr("tooltip-template"), t
						.removeAttr("tooltip-template")), void 0 !== t
				.attr("tooltip-template-url")
				&& (o["tooltip-template-url"] = t.attr("tooltip-template-url"), t
						.removeAttr("tooltip-template-url")), void 0 !== t
				.attr("tooltip-controller")
				&& (o["tooltip-controller"] = t.attr("tooltip-controller"), t
						.removeAttr("tooltip-controller")), void 0 !== t
				.attr("tooltip-side")
				&& (o["tooltip-side"] = t.attr("tooltip-side"), t
						.removeAttr("tooltip-side")), void 0 !== t
				.attr("tooltip-show-trigger")
				&& (o["tooltip-show-trigger"] = t.attr("tooltip-show-trigger"), t
						.removeAttr("tooltip-show-trigger")), void 0 !== t
				.attr("tooltip-hide-trigger")
				&& (o["tooltip-hide-trigger"] = t.attr("tooltip-hide-trigger"), t
						.removeAttr("tooltip-hide-trigger")), void 0 !== t
				.attr("tooltip-smart")
				&& (o["tooltip-smart"] = t.attr("tooltip-smart"), t
						.removeAttr("tooltip-smart")), void 0 !== t
				.attr("tooltip-class")
				&& (o["tooltip-class"] = t.attr("tooltip-class"), t
						.removeAttr("tooltip-class")), void 0 !== t
				.attr("tooltip-close-button")
				&& (o["tooltip-close-button"] = t.attr("tooltip-close-button"), t
						.removeAttr("tooltip-close-button")), void 0 !== t
				.attr("tooltip-size")
				&& (o["tooltip-size"] = t.attr("tooltip-size"), t
						.removeAttr("tooltip-size")), void 0 !== t
				.attr("tooltip-speed")
				&& (o["tooltip-speed"] = t.attr("tooltip-speed"), t
						.removeAttr("tooltip-speed")), o
	}, l = function(t) {
		return o.getComputedStyle ? o.getComputedStyle(t, "") : t.currentStyle
				? t.currentStyle
				: void 0
	}, a = function(e) {
		for (var i, r, l = o.document.querySelectorAll("._exradicated-tooltip"), a = 0, n = l.length; n > a; a += 1)
			if (i = l.item(a), i
					&& (r = t.element(i), r.data("_tooltip-parent")
							&& r.data("_tooltip-parent") === e))
				return r
	}, n = function(t) {
		var o = a(t);
		o && o.remove()
	}, s = function(t) {
		if (t) {
			var e = t[0].getBoundingClientRect();
			return e.top < 0 || e.top > o.document.body.offsetHeight
					|| e.left < 0 || e.left > o.document.body.offsetWidth
					|| e.bottom < 0 || e.bottom > o.document.body.offsetHeight
					|| e.right < 0 || e.right > o.document.body.offsetWidth
					? (t.css({
								top : "",
								left : "",
								bottom : "",
								right : ""
							}), !0)
					: !1
		}
		throw new Error("You must provide a position")
	}, p = function() {
		var t = {
			side : "top",
			showTrigger : "mouseover",
			hideTrigger : "mouseleave",
			"class" : "",
			smart : !1,
			closeButton : !1,
			size : "",
			speed : "steady"
		};
		return {
			configure : function(o) {
				var e, i = Object.keys(t), r = 0;
				if (o)
					for (; r < i.length; r += 1)
						e = i[r], e && o[e] && (t[e] = o[e])
			},
			$get : function() {
				return t
			}
		}
	}, d = ["$log", "$http", "$compile", "$timeout", "$controller",
			"$injector", "tooltipsConf", function(e, p, d, c, m, u, g) {
				var f = function(e, u, f, v, h) {
					if (f.tooltipTemplate && f.tooltipTemplateUrl)
						throw new Error("You can not define tooltip-template and tooltip-url together");
					if (!f.tooltipTemplateUrl && !f.tooltipTemplate
							&& f.tooltipController)
						throw new Error("You can not have a controller without a template or templateUrl defined");
					var C, _ = "_" + g.side, b = g.showTrigger, y = g.hideTrigger, w = g.size, S = "_"
							+ g.speed;
					f.tooltipSide = f.tooltipSide || g.side, f.tooltipShowTrigger = f.tooltipShowTrigger
							|| g.showTrigger, f.tooltipHideTrigger = f.tooltipHideTrigger
							|| g.hideTrigger, f.tooltipClass = f.tooltipClass
							|| g["class"], f.tooltipSmart = "true" === f.tooltipSmart
							|| g.smart, f.tooltipCloseButton = f.tooltipCloseButton
							|| g.closeButton.toString(), f.tooltipSize = f.tooltipSize
							|| g.size, f.tooltipSpeed = f.tooltipSpeed
							|| g.speed, f.tooltipAppendToBody = "true" === f.tooltipAppendToBody, h(
							e, function(e, g) {
								var v = r(e), h = t.element(o.document
										.createElement("tooltip")), T = t
										.element(o.document
												.createElement("tip-cont")), $ = t
										.element(o.document
												.createElement("tip")), A = t
										.element(o.document
												.createElement("tip-tip")), B = t
										.element(o.document
												.createElement("span")), z = t
										.element(o.document
												.createElement("tip-arrow")), E = function() {
									return T.html()
								}, k = function(t) {
									void 0 !== t
											&& T[0].getClientRects().length > 1
											? h.addClass("_multiline")
											: h.removeClass("_multiline")
								}, P = function(e) {
									if ($.addClass("_hidden"), f.tooltipSmart)
										switch (f.tooltipSide) {
											case "top" :
												s($)
														&& (h
																.removeClass("_top"), h
																.addClass("_left"), s($)
																&& (h
																		.removeClass("_left"), h
																		.addClass("_bottom"), s($)
																		&& (h
																				.removeClass("_bottom"), h
																				.addClass("_right"), s($)
																				&& (h
																						.removeClass("_right"), h
																						.addClass("_top")))));
												break;
											case "left" :
												s($)
														&& (h
																.removeClass("_left"), h
																.addClass("_bottom"), s($)
																&& (h
																		.removeClass("_bottom"), h
																		.addClass("_right"), s($)
																		&& (h
																				.removeClass("_right"), h
																				.addClass("_top"), s($)
																				&& (h
																						.removeClass("_top"), h
																						.addClass("_left")))));
												break;
											case "bottom" :
												s($)
														&& (h
																.removeClass("_bottom"), h
																.addClass("_left"), s($)
																&& (h
																		.removeClass("_left"), h
																		.addClass("_top"), s($)
																		&& (h
																				.removeClass("_top"), h
																				.addClass("_right"), s($)
																				&& (h
																						.removeClass("_right"), h
																						.addClass("_bottom")))));
												break;
											case "right" :
												s($)
														&& (h
																.removeClass("_right"), h
																.addClass("_top"), s($)
																&& (h
																		.removeClass("_top"), h
																		.addClass("_left"), s($)
																		&& (h
																				.removeClass("_left"), h
																				.addClass("_bottom"), s($)
																				&& (h
																						.removeClass("_bottom"), h
																						.addClass("_right")))));
												break;
											default :
												throw new Error("Position not supported")
										}
									if (f.tooltipAppendToBody) {
										var i, r, a, p, d, c = l(A[0]), m = l(z[0]), u = l($[0]), g = $[0]
												.getBoundingClientRect(), v = t
												.copy($), C = 0, _ = c.length, b = 0, y = m.length, w = 0, S = u.length, T = {}, B = {}, E = {};
										for ($.removeClass("_hidden"), v
												.removeClass("_hidden"), v
												.data("_tooltip-parent", h), n(h); _ > C; C += 1)
											i = c[C], i
													&& c.getPropertyValue(i)
													&& (T[i] = c
															.getPropertyValue(i));
										for (; y > b; b += 1)
											i = m[b], i
													&& m.getPropertyValue(i)
													&& (E[i] = m
															.getPropertyValue(i));
										for (; S > w; w += 1)
											i = u[w], i
													&& "position" !== i
													&& "display" !== i
													&& "opacity" !== i
													&& "z-index" !== i
													&& "bottom" !== i
													&& "height" !== i
													&& "left" !== i
													&& "right" !== i
													&& "top" !== i
													&& "width" !== i
													&& u.getPropertyValue(i)
													&& (B[i] = u
															.getPropertyValue(i));
										r = o
												.parseInt(
														u
																.getPropertyValue("padding-top"),
														10), a = o
												.parseInt(
														u
																.getPropertyValue("padding-bottom"),
														10), p = o
												.parseInt(
														u
																.getPropertyValue("padding-left"),
														10), d = o
												.parseInt(
														u
																.getPropertyValue("padding-right"),
														10), B.top = g.top
												+ o.scrollY + "px", B.left = g.left
												+ o.scrollX + "px", B.height = g.height
												- (r + a) + "px", B.width = g.width
												- (p + d) + "px", v.css(B), v
												.children().css(T), v
												.children().next().css(E), e
												&& "true" !== f.tooltipHidden
												&& (v
														.addClass("_exradicated-tooltip"), t
														.element(o.document.body)
														.append(v))
									} else
										$.removeClass("_hidden"), e
												&& "true" !== f.tooltipHidden
												&& h.addClass("active")
								}, x = function() {
									f.tooltipAppendToBody ? n(h) : h
											.removeClass("active")
								}, H = function it(t) {
									var o, e = t.parent();
									t[0]
											&& (t[0].scrollHeight > t[0].clientHeight || t[0].scrollWidth > t[0].clientWidth)
											&& t.on("scroll", function() {
												var t = this;
												o && c.cancel(o), o = c(
														function() {
															var o = a(h), e = h[0]
																	.getBoundingClientRect(), i = t
																	.getBoundingClientRect();
															e.top < i.top
																	|| e.bottom > i.bottom
																	|| e.left < i.left
																	|| e.right > i.right
																	? n(h)
																	: o
																			&& P(!0)
														})
											}), e && e.length && it(e)
								}, V = function(t) {
									t
											&& (A.empty(), A.append(B), A
													.append(t), c(function() {
														P()
													}))
								}, R = function(t) {
									t && p.get(t).then(function(t) {
										t
												&& t.data
												&& (A.empty(), A.append(B), A
														.append(d(t.data)(g)), c(
														function() {
															P()
														}))
									})
								}, W = function(t) {
									t
											&& (_ && h.removeAttr("_" + _), h
													.addClass("_" + t), _ = t)
								}, I = function(t) {
									t && (b && h.off(b), h.on(t, P), b = t)
								}, U = function(t) {
									t && (y && h.off(y), h.on(t, x), y = t)
								}, Y = function(t) {
									t
											&& (C && $.removeClass(C), $
													.addClass(t), C = t)
								}, j = function() {
									"boolean" != typeof f.tooltipSmart
											&& (f.tooltipSmart = "true" === f.tooltipSmart)
								}, q = function(t) {
									var o = "true" === t;
									o ? (B.on("click", x), B.css("display",
											"block")) : (B.off("click"), B.css(
											"display", "none"))
								}, O = function(o) {
									if (o) {
										var e, i = m(o, {
													$scope : g
												}), r = g.$new(!1, g), l = o
												.indexOf("as");
										l >= 0
												? (e = o.substr(l + 3), r[e] = i)
												: t.extend(r, i), A
												.replaceWith(d(A)(r)), Z()
									}
								}, F = function(t) {
									t
											&& (w && A.removeClass("_" + w), A
													.addClass("_" + t), w = t)
								}, L = function(t) {
									t
											&& (S && h.removeClass("_" + S), h
													.addClass("_" + t), S = t)
								}, X = f.$observe("tooltipTemplate", V), D = f
										.$observe("tooltipTemplateUrl", R), G = f
										.$observe("tooltipSide", W), J = f
										.$observe("tooltipShowTrigger", I), K = f
										.$observe("tooltipHideTrigger", U), M = f
										.$observe("tooltipClass", Y), N = f
										.$observe("tooltipSmart", j), Q = f
										.$observe("tooltipCloseButton", q), Z = f
										.$observe("tooltipController", O), tt = f
										.$observe("tooltipSize", F), ot = f
										.$observe("tooltipSpeed", L), et = g
										.$watch(E, k);
								B.attr({
											id : "close-button"
										}), B.html("&times;"), $
										.addClass("_hidden"), A.append(B), A
										.append(f.tooltipTemplate), $.append(A), $
										.append(z), T.append(e), h.attr(v), h
										.addClass("tooltips"), h.append(T), h
										.append($), u.after(h), f.tooltipAppendToBody
										&& (i.add(function() {
													H(h)
												}), H(h)), i.add(function() {
											k(), P()
										}), c(function() {
											P(), $.removeClass("_hidden"), h
													.addClass("_ready")
										}), g.$on("$destroy", function() {
									X(), D(), G(), J(), K(), M(), N(), Q(), tt(), ot(), et(), e
											.off(f.tooltipShowTrigger + " "
													+ f.tooltipHideTrigger)
								})
							})
				};
				return {
					restrict : "A",
					transclude : "element",
					priority : 1,
					terminal : !0,
					link : f
				}
			}];
	t.module("720kb.tooltips", []).provider(e + "Conf", p).directive(e, d)
}(angular, window);
//# sourceMappingURL=angular-tooltips.js.map
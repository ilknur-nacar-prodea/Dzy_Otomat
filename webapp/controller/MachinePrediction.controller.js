sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/ui/core/UIComponent",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/BusyIndicator", "sap/m/MessageToast", "sap/m/library",
	"sap/ui/core/routing/History"
], function (e, t, o, i, r, n, a, s, c, u) {
	"use strict";
	var d, l, p, h, g;
	var m = new t;
	var w = new t;
	var simple;
	return e.extend("app.DzyOtomat.controller.MachinePrediction", {
		formatter: o,
		onInit: function () {
			var e = i.getRouterFor(this);
			e.getRoute("MachinePrediction").attachMatched(this._onObjectMatchedDetail, this)
		},
		_onObjectMatchedDetail: function (e) {
			var t = e.getParameter("arguments");
			d = t.trip;
			l = t.ino;
			p = t.location;
			h = t.machine;
			g = t.control;
			simple = t.simple;
			this._readHistory()
		},
		_readHistory: function () {
			a.show();
			var e = this,
				t = this.getOwnerComponent().getModel();
			var o = [];
			o.push(new r("Zztrip", n.EQ, d));
			o.push(new r("ZztripIno", n.EQ, l));
			o.push(new r("ZztripLocation", n.EQ, p));
			o.push(new r("ZztripVendmac", n.EQ, h));
			t.read("/LocationSet", {
				filters: o,
				success: function (t) {
					debugger;
					e.getView().setModel(m, "oHeader");
					e.getView().getModel("oHeader").setData(t.results[0]);
					a.hide()
				},
				error: function (t) {
					s.show(e.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"));
					a.hide()
				}
			});
			t.read("/MachinePredictionSet", {
				filters: o,
				success: function (t) {
					e.getView().setModel(w, "oPrediction");
					e.getView().getModel("oPrediction").setData(t.results);
					a.hide()
				},
				error: function (t) {
					s.show(e.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"));
					a.hide()
				}
			})
		},
		onNavBack: function () {
			if (simple != 'X') {
				i.getRouterFor(this).navTo("TripResults", {
					trip: d,
					simple: ' '
				})
			} else {
				i.getRouterFor(this).navTo("Trips", {
					trip: d,
					simple: 'X'
				})
			}
		}
	})
});
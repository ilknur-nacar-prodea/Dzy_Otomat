sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/ui/core/UIComponent",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/BusyIndicator", "sap/m/MessageToast", "sap/m/library",
	"sap/ui/core/routing/History"
], function (e, t, o, i, r, n, a, s, c, u) {
	"use strict";
	var l, d, h, p, g;
	var m = new t;
	var simple;
	var v = new t;
	return e.extend("app.DzyOtomat.controller.MachineHistory", {
		formatter: o,
		onInit: function () {
			var e = i.getRouterFor(this);
			e.getRoute("MachineHistory").attachMatched(this._onObjectMatchedDetail, this)
		},
		_onObjectMatchedDetail: function (e) {
			var t = e.getParameter("arguments");
			l = t.trip;
			d = t.ino;
			h = t.location;
			p = t.machine;
			g = t.control;
			simple = t.simple;
			this._readHistory()
		},
		_readHistory: function () {
			a.show();
			var e = this,
				t = this.getOwnerComponent().getModel();
			var o = [];
			o.push(new r("Zztrip", n.EQ, l));
			o.push(new r("ZztripIno", n.EQ, d));
			o.push(new r("ZztripLocation", n.EQ, h));
			o.push(new r("ZztripVendmac", n.EQ, p));
			t.read("/LocationSet", {
				filters: o,
				success: function (t) {
					e.getView().setModel(m, "oHeader");
					e.getView().getModel("oHeader").setData({
						ZzvenScode: t.results[0].ZzvenScode,
						ZzvenSdesc: t.results[0].ZzvenSdesc
					});
					a.hide()
				},
				error: function (t) {
					s.show(e.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"));
					a.hide()
				}
			});
			t.read("/MachineHistorySet", {
				filters: o,
				success: function (t) {
					e.getView().setModel(v, "oHistory");
					e.getView().getModel("oHistory").setData(t.results);
					a.hide()
				},
				error: function (t) {
					s.show(e.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"));
					a.hide()
				}
			})
		},
		onNavBack: function () {
			if ( simple != 'X') {
				i.getRouterFor(this).navTo("MachineDetail", {
					trip: l,
					ino: d,
					location: h,
					machine: p,
					control: g,
					simple : ' '
				})
			} else {
				i.getRouterFor(this).navTo("MachineDetailBarcode", {
					trip: l,
					ino: d,
					location: h,
					machine: p,
					control: g,
					simple : 'X'
				})
			}
		}
	})
});
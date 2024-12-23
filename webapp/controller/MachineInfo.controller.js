sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/ui/core/UIComponent",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/BusyIndicator", "sap/m/MessageToast", "sap/m/library",
	"sap/ui/core/routing/History"
], function (e, t, o, n, i, r, a, s, c, u) {
	"use strict";
	var l, d, h, p, g;
	var f = new t;
	var m = new t;
	var simple;
	return e.extend("app.DzyOtomat.controller.MachineInfo", {
		formatter: o,
		onInit: function () {
			var e = n.getRouterFor(this);
			e.getRoute("MachineInfo").attachMatched(this._onObjectMatchedDetail, this)
		},
		_onObjectMatchedDetail: function (e) {
			var t = e.getParameter("arguments");
			l = t.trip;
			d = t.ino;
			h = t.location;
			p = t.machine;
			g = t.control;
			simple = t.simple;
			this._readInfo()
		},
		_readInfo: function () {
			a.show();
			var e = this,
				t = this.getOwnerComponent().getModel();
			var o = [];
			o.push(new i("Zztrip", r.EQ, l));
			o.push(new i("ZztripIno", r.EQ, d));
			o.push(new i("ZztripLocation", r.EQ, h));
			o.push(new i("ZztripVendmac", r.EQ, p));
			t.read("/MachineInfoSet", {
				filters: o,
				success: function (t) {
					e.getView().setModel(f, "oInfo");
					e.getView().getModel("oInfo").setData(t.results[0]);
					a.hide()
				},
				error: function (t) {
					s.show(e.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"));
					a.hide()
				}
			});
			t.read("/MachineNoteSet", {
				filters: o,
				success: function (t) {
					e.getView().setModel(m, "oNotes");
					e.getView().getModel("oNotes").setData(t.results);
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
				n.getRouterFor(this).navTo("MachineDetail", {
					trip: l,
					ino: d,
					location: h,
					machine: p,
					control: g,
					simple: ' '
				})
			} else {
				n.getRouterFor(this).navTo("MachineDetailBarcode", {
					trip: l,
					ino: d,
					location: h,
					machine: p,
					control: g,
					simple: 'X'
				})
			}
		}
	})
});
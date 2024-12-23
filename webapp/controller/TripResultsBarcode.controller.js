sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/ui/core/UIComponent",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/BusyIndicator", "sap/m/MessageToast", "sap/m/library"
], function (e, t, o, r, n, i, a, s, c) {
	"use strict";
	var l = c.URLHelper;
	var u;
	var d = new t;
	return e.extend("app.DzyOtomat.controller.TripResultsBarcode", {
		formatter: o,
		onInit: function () {
			var e = r.getRouterFor(this);
			e.getRoute("TripResultsBarcode").attachMatched(this._onObjectMatchedDetail, this)
		},
		_onObjectMatchedDetail: function (e) {
			var t = e.getParameter("arguments");
			u = t.trip;
			this._readLocations()
		},
		_readLocations: function () {
			a.show();
			var e = this,
				t = this.getOwnerComponent().getModel();
			var o = [];
			o.push(new n("Zztrip", i.EQ, u));
			t.read("/LocationSet", {
				filters: o,
				success: function (t) {
					debugger;
					e.getView().setModel(d, "oLocations");
					var o = [];
					var r = [];
					for (var n = 0; n < t.results.length; n++) {
						var i = o.filter(function (e) {
							return e.ZztripLocation === t.results[n].ZztripLocation
						});
						var s = i.length > 0;
						if (!s) {
							r = [];
							for (var c = 0; c < t.results.length; c++) {
								if (t.results[n].ZztripLocation === t.results[c].ZztripLocation) {
									r.push({
										ZztripVendmac: t.results[c].ZztripVendmac,
										ZzvenLgnum: t.results[c].ZzvenLgnum,
										ZzvenLgpla: t.results[c].ZzvenLgpla,
										ZzvenScode: t.results[c].ZzvenScode,
										ZzvenSdesc: t.results[c].ZzvenSdesc,
										ZzvenTelid: t.results[c].ZzvenTelid,
										ZzvenTyped: t.results[c].ZzvenTyped
									})
								}
							}
							o.push({
								Zztrip: t.results[n].Zztrip,
								ZztripIno: t.results[n].ZztripIno,
								ZztripLocation: t.results[n].ZztripLocation,
								ZzlocName: t.results[n].ZzlocName,
								ZzlocPluscode: t.results[n].ZzlocPluscode,
								ZzlocLatitude: t.results[n].ZzlocLatitude,
								ZzlocLongitude: t.results[n].ZzlocLongitude,
								Address: t.results[n].Address,
								machines: r
							})
						}
					}
					e.getView().getModel("oLocations").setData(o);
					a.hide()
				},
				error: function (t) {
					s.show(e.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"));
					a.hide()
				}
			})
		},
		onExpandLocation: function (e) {
			var t = e.getSource().getParent().getProperty("expanded");
			e.getSource().getParent().setProperty("expanded", !t)
		},
		onNavToMachine: function (e) {
			var t = e.getSource().oPropagatedProperties.oBindingContexts.oLocations.sPath.slice(1);
			var o = e.getSource().oBindingContexts.oLocations.sPath.split("/")[3];
			var n = this.getView().getModel("oLocations").getData();
			r.getRouterFor(this).navTo("MachineDetail", {
				trip: u,
				ino: n[t].ZztripIno,
				location: n[t].ZztripLocation,
				machine: n[t].machines[o].ZztripVendmac,
				control: false,
				simple: ' ',
			})
		},
		onNavToMaps: function (e) {
			debugger;
			var t = e.getSource().oPropagatedProperties.oBindingContexts.oLocations.sPath.slice(1);
			var o = this.getView().getModel("oLocations").getData();
			var r = "https://www.google.com/maps/dir//" + o[t].ZzlocLatitude + "," + o[t].ZzlocLongitude;
			l.redirect(r, true)
		},
		onNavToPrediction: function (e) {
			var t = e.getSource().oPropagatedProperties.oBindingContexts.oLocations.sPath.slice(1);
			var o = this.getView().getModel("oLocations").getData();
			r.getRouterFor(this).navTo("MachinePrediction", {
				trip: u,
				ino: o[t].ZztripIno,
				location: o[t].ZztripLocation,
				machine: "X",
				control: false
			})
		},
		onNavBack: function () {
			var e = this.getOwnerComponent().getRouter();
			e.navTo("Trips", true)
		}
	})
});
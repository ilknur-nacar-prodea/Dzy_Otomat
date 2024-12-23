sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/ui/core/UIComponent",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/BusyIndicator", "sap/m/MessageToast", "sap/m/library",
	"sap/ui/core/routing/History", "sap/ndc/BarcodeScanner"
], function (e, t, o, s, a, n, i, r, c, l, d) {
	"use strict";
	var u, h, g, p, M;
	return e.extend("app.DzyOtomat.controller.MachineControl", {
		formatter: o,
		onInit: function () {
			var e = s.getRouterFor(this);
			e.getRoute("MachineControl").attachMatched(this._onObjectMatchedDetail, this)
		},
		_onObjectMatchedDetail: function (e) {
			var o = e.getParameter("arguments");
			u = o.trip;
			h = o.ino;
			g = o.location;
			p = o.machine;
			M = o.control;
			this.getView().setModel(new t, "oControl");
			this.getView().getModel("oControl").setData({
				blocked: M === "true" ? true : false
			})
		},
		onScanSuccess: function (e) {
			var t = e.getParameter("text");
			this._validateBarcode(t)
		},
		_validateBarcode: function (e) {
			if (e === undefined || e.replace(/ /g, "") === "") {
				M = false;
				return
			}
			var t = this,
				o = this.getView().getModel();
			i.show();
			o.callFunction("/ValidateBarcode", {
				method: "GET",
				urlParameters: {
					trip: u,
					ino: h,
					location: g,
					machine: p,
					barcode: e
				},
				success: function (e) {
					i.hide();
					if (e.results.length > 0) {
						t.showMessages(e.results)
					} else {
						M = true;
						t.onNavBack()
					}
				},
				error: function (e) {
					r.show(t.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"));
					i.hide()
				}
			})
		},
		onScanError: function (e) {},
		showMessages: function (e) {
			var t = [];
			var o = e;
			for (var s = 0; s < o.length; s++) {
				var a = o[s];
				var n = {
					MessageType: a.Type,
					Message: a.Message
				};
				t.push(n)
			}
			var i = new sap.ui.model.json.JSONModel;
			this.getView().setModel(i, "oMsgModel");
			this.getView().getModel("oMsgModel").setData(t);
			if (!this.oMessage) {
				this.oMessage = sap.ui.xmlfragment("app.DzyOtomat.view.fragments.depoUrunTalep.Messages", this);
				this.getView().addDependent(this.oMessage)
			}
			this.oMessage.open()
		},
		onMessageClose: function () {
			this.oMessage.close();
			this.oMessage = undefined
		},
		onNavBack: function () {
			if (M === undefined) {
				M = false
			}
			s.getRouterFor(this).navTo("MachineDetail", {
				trip: u,
				ino: h,
				location: g,
				machine: p,
				control: M,
				simple : ' '
			})
		},
		openBarcodeScannerDialog: function () {
			this.byId("bsd").show()
		},
		handleScanError: function (e) {
			this.byId("scanResultLabel").setText("Error result: " + e.getParameter("message"));
			this.byId("bsd").close()
		},
		handleScanSuccess: function (e) {
			this.byId("scanResultLabel").setText("Success result: " + e.getParameter("text"));
			this.byId("bsd").close()
		}
	})
});
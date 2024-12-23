sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/ui/core/UIComponent",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/BusyIndicator", "sap/m/MessageToast", "sap/m/library",
	"sap/ui/core/routing/History", "sap/ndc/BarcodeScanner"
], function (e, t, o, s, a, n, i, r, c, l, d) {
	"use strict";
	var u, h, g, p, M;
	return e.extend("app.DzyOtomat.controller.MachineControlBarcode", {
		formatter: o,
		onInit: function () {
			var e = s.getRouterFor(this);
			e.getRoute("MachineControlBarcode").attachMatched(this._onObjectMatchedDetail, this)
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
			var that = this,
				dataModel = this.getView().getModel();
			i.show();
			debugger;
			// var filters = [];
			// filters.push(new sap.ui.model.Filter("Zztrip", s.EQ, u));
			// filters.push(new sap.ui.model.Filter("ZztripVendmac", s.EQ, e));
			dataModel.read("/MachineInfoFrmBarcodeSet(Zztrip='" + u + "',ZzvenTelid='" + e + "')", {
				success: function (data, response) {
					M = true;
					var v = new sap.ui.model.json.JSONModel;
					that.getView().setModel(v, "oMachine");
					that.getView().getModel("oMachine").setProperty("/isControlled", M);
					that.getView().getModel("oMachine").setProperty("/detail", data);
					i.hide()
					s.getRouterFor(that).navTo("MachineDetailBarcode", {
						trip: u,
						ino: data.ZztripIno,
						location: data.ZztripLocation,
						machine: data.ZztripVendmac,
						control: M,
						simple : 'X'
					})

				},
				error: function (t) {
					var err;
					var msg;
					try {
						msg = t.responseText.split('value')[1].split('}')[0].split('":"')[1].split('"')[0];
						r.show(msg);
					} catch (err) {
						r.show(e.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"));
					}
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
			s.getRouterFor(this).navTo("Trips", {
				trip: u
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
sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/ui/core/UIComponent",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/BusyIndicator", "sap/m/MessageToast"
], function (e, t, o, n, i, s, r, a) {
	"use strict";
	var p = sap.ui.core.format.DateFormat.getTimeInstance({
			pattern: "KK:mm:ss a"
		}),
		g = new Date(0).getTimezoneOffset() * 60 * 1e3;
	var l, u;
	var c = new t;
	var m;
	return e.extend("app.DzyOtomat.controller.Trips", {
		formatter: o,
		onInit: function () {
			this._readVehicleTrips()
		},
		_readVehicleTrips: function () {
			r.show();
			var e = this,
				t = this.getOwnerComponent().getModel();
			t.read("/TripSet('XXX')", {
				success: function (t) {
					debugger;
					e._formatResponse(t, e);
					l = t.Zztrip;
					u = t.ZztripVehicle;
					t.Zztrip === "00000000" && (t.Zztrip = "X", a.show(e.getOwnerComponent().getModel("i18n").getResourceBundle().getText(
						"TripNotFound")));
					e.getView().setModel(c, "oTripDetail");
					e.getView().getModel("oTripDetail").setData(t)
				},
				error: function (t) {
					a.show(e.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"))
				}
			});
			r.hide()
		},
		_formatResponse: function (e, t) {
			var o;
			o = e.ZztripRtime.ms;
			e.ZztripRtime.ms = t._formatTime(o);
			o = e.ZztripEtime.ms;
			e.ZztripEtime.ms = t._formatTime(o)
		},
		_formatTime: function (e) {
			return p.format(new Date(e + g))
		},
		onConfirmCreateTtip: function (e) {
			if (!this.oApproveDialog) {
				this.oApproveDialog = new sap.m.Dialog({
					type: sap.m.DialogType.Message,
					title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmTitle"),
					content: new sap.m.Text({
						text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmCreateTtip")
					}),
					beginButton: new sap.m.Button({
						type: sap.m.ButtonType.Emphasized,
						text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmBtn"),
						press: function () {
							this.oApproveDialog.close();
							this.onCreateTtip()
						}.bind(this)
					}),
					endButton: new sap.m.Button({
						text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("CancelBtn"),
						press: function () {
							this.oApproveDialog.close()
						}.bind(this)
					})
				});
				this.oApproveDialog.open()
			} else {
				this.oApproveDialog.close();
				this.oApproveDialog = undefined;
				this.onConfirmCreateTtip()
			}
		},
		onCreateTtip: function (e) {
			r.show();
			var t = this,
				o = this.getOwnerComponent().getModel();
			var n = {
				ZzvehicleUname: "XXX",
				ZztripDate: new Date
			};
			o.create("/TripSet", n, {
				success: function (e) {
					r.hide();
					var o = [{
						Type: "S",
						Message: t.getOwnerComponent().getModel("i18n").getResourceBundle().getText("TripCreated")
					}];
					t.showMessages(o)
				},
				error: function (e) {
					a.show(t.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"));
					r.hide()
				}
			})
		},
		onOptimizeRoute: function (e) {
			a.show("YAPILACAK")
		},
		onNavToStockRequest: function (e) {
			n.getRouterFor(this).navTo("StockReq", {
				trip: "X",
				plate: "X"
			})
		},
		onNavToUploadVehicle: function (e) {
			n.getRouterFor(this).navTo("ConfirmStockReq", {
				trip: "1",
				plate: "1"
			})
		},
		onNavToTripResults: function (e) {
			n.getRouterFor(this).navTo("TripResults", {
				trip: l
			})
		},
		onNavToTripResultsBarcode: function (e) {
			// n.getRouterFor(this).navTo("TripResultsBarcode", {
			// 	trip: l
			// })
			var trip = this.getView().getModel("oTripDetail").getProperty("/Zztrip");
			n.getRouterFor(this).navTo("MachineControlBarcode", {
				trip: trip
			})

		},
		onNavToReturnStock: function (e) {
			n.getRouterFor(this).navTo("ReturnStock", {
				trip: "X",
				plate: "X"
			})
		},
		onNavToReturnStockAlt: function (e) {
			n.getRouterFor(this).navTo("ReturnStockAlt", {
				trip: "X",
				plate: "X"
			})
		},
		onNavToConvert2Damaged: function (e) {
			n.getRouterFor(this).navTo("Convert2Damaged", {
				trip: "X",
				plate: "X"
			})
		},
		onNavToCreateCounting: function (e) {
			n.getRouterFor(this).navTo("Counting", {
				trip: "X",
				plate: "X"
			})
		},
		onNavToStockReport: function (e) {
			n.getRouterFor(this).navTo("SReport", {
				trip: "X",
				plate: "X"
			})
		},
		onNavToStockReportDamaged: function (e) {
			n.getRouterFor(this).navTo("SReportDamaged", {
				trip: "X",
				plate: "X"
			})
		},
		onConfirmCloseTrip: function (e) {
			if (!this.oApproveDialog) {
				this.oApproveDialog = new sap.m.Dialog({
					type: sap.m.DialogType.Message,
					title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmTitle"),
					content: new sap.m.Text({
						text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmCloseTrip")
					}),
					beginButton: new sap.m.Button({
						type: sap.m.ButtonType.Emphasized,
						text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmBtn"),
						press: function () {
							this.oApproveDialog.close();
							this.onCloseTrip()
						}.bind(this)
					}),
					endButton: new sap.m.Button({
						text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("CancelBtn"),
						press: function () {
							this.oApproveDialog.close()
						}.bind(this)
					})
				});
				this.oApproveDialog.open()
			} else {
				this.oApproveDialog.close();
				this.oApproveDialog = undefined;
				this.onConfirmCloseTrip()
			}
		},
		onCloseTrip: function (e) {
			r.show();
			var t = this,
				o = this.getOwnerComponent().getModel();
			r.show();
			o.callFunction("/CloseTrip", {
				method: "GET",
				urlParameters: {
					trip: l
				},
				success: function (e) {
					r.hide();
					t.showMessages(e.results)
				},
				error: function (e) {
					a.show(t.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"));
					r.hide()
				}
			})
		},
		showMessages: function (e) {
			var t = [];
			var o = e;
			for (var n = 0; n < o.length; n++) {
				var i = o[n];
				var s = {
					MessageType: i.Type,
					Message: i.Message
				};
				t.push(s)
			}
			var r = new sap.ui.model.json.JSONModel;
			this.getView().setModel(r, "oMsgModel");
			this.getView().getModel("oMsgModel").setData(t);
			if (!this.oMessage) {
				this.oMessage = sap.ui.xmlfragment("app.DzyOtomat.view.fragments.depoUrunTalep.Messages", this);
				this.getView().addDependent(this.oMessage)
			}
			this.oMessage.open()
		},
		onMessageClose: function () {
			this.oMessage.close();
			this._readVehicleTrips()
		}
	})
});
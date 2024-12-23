sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/ui/core/UIComponent",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/BusyIndicator", "sap/m/MessageToast", "sap/m/library", "sap/m/Dialog",
	"sap/ui/Device"
], function (e, t, o, n, i, s, a, r, l, c, p) {
	"use strict";
	var g, h, u, d, m;
	var v = new t;
	var simple;
	var success;
	return e.extend("app.DzyOtomat.controller.MachineDetailBarcode", {
		formatter: o,
		onInit: function () {
			var e = n.getRouterFor(this);
			e.getRoute("MachineDetailBarcode").attachMatched(this._onObjectMatchedDetail, this)
		},
		_onObjectMatchedDetail: function (e) {
			var t = e.getParameter("arguments");
			success = '';
			g = t.trip;
			h = t.ino;
			u = t.location;
			d = t.machine;
			m = t.control;
			simple = t.simple;
			this._readMachine()
		},
		_readMachine: function () {
			a.show();
			var e = this,
				t = this.getOwnerComponent().getModel();
			var o = [];
			o.push(new i("Zztrip", s.EQ, g));
			o.push(new i("ZztripIno", s.EQ, h));
			o.push(new i("ZztripLocation", s.EQ, u));
			o.push(new i("ZztripVendmac", s.EQ, d));
			t.read("/LocationSet", {
				filters: o,
				success: function (t) {
					e.getView().setModel(v, "oMachine");
					e.getView().getModel("oMachine").setProperty("/isControlled", m);
					e.getView().getModel("oMachine").setProperty("/detail", t.results[0]);
					a.hide()
				},
				error: function (t) {
					r.show(e.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"));
					a.hide()
				}
			})
		},
		onNavToControl: function () {
			n.getRouterFor(this).navTo("MachineControl", {
				trip: g,
				ino: h,
				location: u,
				machine: d,
				control: m
			})
		},
		onNavToUpload: function () {
			n.getRouterFor(this).navTo("MachineUpload", {
				trip: g,
				ino: h,
				location: u,
				machine: d,
				control: m,
				detail: 1,
				simple : 'X'
			})
		},
		onNavToInfo: function () {
			n.getRouterFor(this).navTo("MachineInfo", {
				trip: g,
				ino: h,
				location: u,
				machine: d,
				control: m,
				simple : 'X'
			})
		},
		onNavToNote: function () {
			n.getRouterFor(this).navTo("MachineNote", {
				trip: g,
				ino: h,
				location: u,
				machine: d,
				control: m,
				simple : 'X'
			})
		},
		onNavToHistory: function () {
			n.getRouterFor(this).navTo("MachineHistory", {
				trip: g,
				ino: h,
				location: u,
				machine: d,
				control: m,
				simple : 'X'
			})
		},
		onNavToPrediction: function () {
			n.getRouterFor(this).navTo("MachinePrediction", {
				trip: g,
				ino: h,
				location: u,
				machine: d,
				control: m,
				simple : 'X'
			})
		},
		onNavToUplPhoto: function (e) {
			n.getRouterFor(this).navTo("UploadImage", {
				trip: g,
				ino: h,
				location: u,
				machine: d,
				control: m,
				simple : 'X'
			})
		},
		onConfirmCheckOut: function () {
			if (!this.oApproveDialog) {
				this.oApproveDialog = new sap.m.Dialog({
					type: sap.m.DialogType.Message,
					title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmTitle"),
					content: new sap.m.Text({
						text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmCheckOut")
					}),
					beginButton: new sap.m.Button({
						type: sap.m.ButtonType.Emphasized,
						text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmBtn"),
						press: function () {
							this.oApproveDialog.close();
							this.onCheckOut()
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
				this.onConfirmCheckOut()
			}
		},
		onCheckOut: function () {
			var e = this.getView().getModel("oGlobalModel").getData();
			if (!e.sessionImageUpload) {
				r.show(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("UploadImageErr"));
				return
			}
			a.show();
			var t = this,
				o = this.getOwnerComponent().getModel();
			a.show();
			o.callFunction("/SaveMachine", {
				method: "GET",
				urlParameters: {
					trip: g,
					ino: h,
					location: u,
					machine: d
				},
				success: function (e) {
					a.hide();
					var successL = e.results.filter(function (i, index) {
						return i.Type === 'S' && i.Number === '004';
					});
					if (successL.length >= 1) {
						success = 'X';
					}
					t.showMessages(e.results)
				},
				error: function (e) {
					var o = e.responseText.split("RFC Error: ")[1].split("<")[0];
					if (o === "") {
						r.show(t.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"))
					} else {
						r.show(o)
					}
					a.hide()
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
			var a = new sap.ui.model.json.JSONModel;
			this.getView().setModel(a, "oMsgModel");
			this.getView().getModel("oMsgModel").setData(t);
			if (!this.oMessage) {
				this.oMessage = sap.ui.xmlfragment("app.DzyOtomat.view.fragments.depoUrunTalep.Messages", this);
				this.getView().addDependent(this.oMessage)
			}
			this.oMessage.open()
		},
		onMessageClose: function () {
			this.oMessage.close();
			 if( success === 'X' )
		     {
			 this.onNavBack();
		     }
		     success = '';
		},
		onConfirmNavBack: function () {
			if (!this.oApproveDialog) {
				this.oApproveDialog = new sap.m.Dialog({
					type: sap.m.DialogType.Message,
					title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmTitle"),
					content: new sap.m.Text({
						text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmNavBack")
					}),
					beginButton: new sap.m.Button({
						type: sap.m.ButtonType.Emphasized,
						text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmBtn"),
						press: function () {
							this.oApproveDialog.close();
							this.onNavBack()
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
				this.onConfirmNavBack()
			}
		},
		onNavBack: function () {
			n.getRouterFor(this).navTo("Trips", {
				trip: g
			})
		}
	})
});
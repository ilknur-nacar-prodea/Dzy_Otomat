sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/ui/core/UIComponent",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/BusyIndicator", "sap/m/MessageToast", "sap/m/library",
	"sap/ui/core/routing/History", "sap/ui/core/library"
], function (e, t, o, n, i, s, a, r, g, l, d) {
	"use strict";
	var p = d.ValueState;
	var c, u, h, m, v;
	var w = new t;
	var C = new t;
	var simple ;
	return e.extend("app.DzyOtomat.controller.MachineNote", {
		formatter: o,
		onInit: function () {
			var e = n.getRouterFor(this);
			e.getRoute("MachineNote").attachMatched(this._onObjectMatchedDetail, this)
		},
		_onObjectMatchedDetail: function (e) {
			var t = e.getParameter("arguments");
			c = t.trip;
			u = t.ino;
			h = t.location;
			m = t.machine;
			v = t.control;
			simple = t.simple;
			this._readHeader()
		},
		_readHeader: function () {
			a.show();
			var e = this,
				t = this.getOwnerComponent().getModel();
			var o = [];
			o.push(new i("Zztrip", s.EQ, c));
			o.push(new i("ZztripIno", s.EQ, u));
			o.push(new i("ZztripLocation", s.EQ, h));
			o.push(new i("ZztripVendmac", s.EQ, m));
			t.read("/LocationSet", {
				filters: o,
				success: function (t) {
					e.getView().setModel(w, "oHeader");
					e.getView().getModel("oHeader").setData({
						ZzvenScode: t.results[0].ZzvenScode,
						ZzvenSdesc: t.results[0].ZzvenSdesc
					});
					a.hide()
				},
				error: function (t) {
					r.show(e.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"));
					a.hide()
				}
			});
			t.read("/NoteCodesSet", {
				success: function (t) {
					e.getView().setModel(C, "oCodes");
					e.getView().getModel("oCodes").setData(t.results);
					a.hide()
				},
				error: function (t) {
					r.show(e.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"));
					a.hide()
				}
			})
		},
		onChangeCode: function (e) {
			var t = this.getView().byId("IdCboxCode");
			var o = t._getSelectedItemText();
			var n = t.getValue();
			if (o !== n) {
				t.setValueState(p.Error);
				t.setValueStateText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("SelectCodeCorrectErr"))
			} else {
				t.setValueState(p.None)
			}
		},
		onConfirmSaveNote: function () {
			var e = this.getView().byId("IdCboxCode").getSelectedKey();
			if (e === "") {
				r.show(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("SelectCodeErr"));
				return
			}
			var t = this.byId("IdInpNote").getValue();
			if (t.replace(/ /g, "") === "") {
				r.show(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("InpNoteErr"));
				return
			}
			if (!this.oApproveDialog) {
				this.oApproveDialog = new sap.m.Dialog({
					type: sap.m.DialogType.Message,
					title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmTitle"),
					content: new sap.m.Text({
						text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmSaveNote")
					}),
					beginButton: new sap.m.Button({
						type: sap.m.ButtonType.Emphasized,
						text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmBtn"),
						press: function () {
							this.oApproveDialog.close();
							this.onSaveNote()
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
				this.onConfirmSaveNote()
			}
		},
		onSaveNote: function () {
			a.show();
			var e = this,
				t = this.getOwnerComponent().getModel();
			var o = {
				Zztrip: c,
				ZztripIno: u,
				ZztripLocation: h,
				ZztripVendmac: m,
				ZztripNoteCode: this.getView().byId("IdCboxCode").getSelectedKey(),
				ZztripNote: this.getView().byId("IdInpNote").getValue()
			};
			t.create("/MachineNoteSet", o, {
				success: function (t) {
					a.hide();
					var o = [{
						Type: "S",
						Message: e.getOwnerComponent().getModel("i18n").getResourceBundle().getText("SaveNoteComplete")
					}];
					e.showMessages(o)
				},
				error: function (t) {
					r.show(e.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"));
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
			this.onClearNote();
			this.onNavBack()
		},
		onConfirmNavBack: function () {
			var e = this.getView().byId("IdCboxCode").getSelectedKey();
			if (e === "") {
				this.onNavBack();
				return
			}
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
			if (simple != 'X') {
				n.getRouterFor(this).navTo("MachineDetail", {
					trip: c,
					ino: u,
					location: h,
					machine: m,
					control: v,
					simple: ' '
				})
			} else {
				n.getRouterFor(this).navTo("MachineDetailBarcode", {
					trip: c,
					ino: u,
					location: h,
					machine: m,
					control: v,
					simple: 'X'
				})
			}
		},
		onClearNote: function () {
			this.getView().byId("IdCboxCode").setSelectedKey();
			this.getView().byId("IdCboxCode").setValue();
			this.byId("IdInpNote").setValue()
		}
	})
});
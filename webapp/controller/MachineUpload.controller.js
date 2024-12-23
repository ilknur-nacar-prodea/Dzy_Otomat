sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/ui/core/UIComponent",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/BusyIndicator", "sap/m/MessageToast", "sap/m/library",
	"sap/ui/core/routing/History"
], function (e, t, n, o, i, a, r, s, l, d) {
	"use strict";
	var g, u, v, c, p, h, m = {},
		M, Z, f = [];
	var simple;
	var z = new t;
	var C = new t;
	return e.extend("app.DzyOtomat.controller.MachineUpload", {
		formatter: n,
		onInit: function () {
			this.getView().setModel(z, "oHeader");
			this.getView().setModel(C, "oMaterial");
			var e = o.getRouterFor(this);
			e.getRoute("MachineUpload").attachMatched(this._onObjectMatchedDetail, this)
		},
		_onObjectMatchedDetail: function (e) {
			var t = e.getParameter("arguments");
			g = t.trip;
			u = t.ino;
			v = t.location;
			c = t.machine;
			p = t.control;
			simple = t.simple;
			h = t.detail.split("#");
			if (h.length > 1) {
				M = true;
				m = {
					Matnr: h[0],
					Maktx: h[1],
					Current: h[2],
					Filled: h[3],
					Emptied: h[4],
					Bad: h[5],
					Last: h[6],
					Sold: h[7],
					Cap: h[8],
					Meins: h[9],
					Retrun: h[10]
				}
			} else {
				M = false
			}
			this._readMaterials()
		},
		_readMaterials: function () {
			r.show();
			var e = this,
				t = this.getOwnerComponent().getModel();
			var n = [];
			n.push(new i("Zztrip", a.EQ, g));
			n.push(new i("ZztripIno", a.EQ, u));
			n.push(new i("ZztripLocation", a.EQ, v));
			n.push(new i("ZztripVendmac", a.EQ, c));
			t.read("/LocationSet", {
				filters: n,
				success: function (t) {
					e.getView().getModel("oHeader").setData({
						ZzvenScode: t.results[0].ZzvenScode,
						ZzvenSdesc: t.results[0].ZzvenSdesc
					});
					r.hide()
				},
				error: function (t) {
					s.show(e.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"));
					r.hide()
				}
			});
			if (!M) {
				if (Z === undefined || Z === "") {
					t.read("/MachineSet", {
						filters: n,
						success: function (t) {
							e.getView().getModel("oMaterial").setData(t.results);
							f = t.results;
							debugger;
							var n = e.getView().byId("grid1");
							var o = n.getItems();
							for (var i = 0; i < o.length; i++) {
								var a = e.getView().getModel("oMaterial").getData()[i].VehcStock;
								if (a <= 0) {
									n.getItems()[i].addStyleClass("outOfStockColor")
								} else {
									n.getItems()[i].addStyleClass("inStockColor")
								}
							}
							r.hide()
						},
						error: function (t) {
							s.show(e.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"));
							r.hide()
						}
					})
				}
			} else {
				if (f.length > 0) {
					var o = f.filter(function (e, t) {
						if (e.ZzvenMatnr === m.Matnr) {
							f.splice(t, 1)
						}
						return e.ZzvenMatnr === m.Matnr
					});
					o[0].ZzvenCurrent = m.Current;
					o[0].ZzvenFilled = m.Filled;
					o[0].ZvenEmtyied = m.Emptied;
					o[0].ZvenBad = m.Bad;
					o[0].ZzvenLast = m.Last;
					o[0].ZzvenMeins = m.Meins;
					o[0].ZvenReturn = m.Retrun;
					f.push(o[0]);
					f.sort(function (e, t) {
						if (Number(e.ZzvenNo) > Number(t.ZzvenNo)) {
							return 1
						} else if (Number(e.ZzvenNo) < Number(t.ZzvenNo)) {
							return -1
						} else {
							return 0
						}
					});
					e.getView().getModel("oMaterial").setData(f)
				}
			}
			if (Z !== undefined && Z !== "") {
				var l = f.filter(function (e) {
					return e.ZzvenMatnr === Z
				});
				e.getView().getModel("oMaterial").setData(l)
			}
		},
		onScanMaterial: function (e) {
			var t = e.getParameter("text");
			r.show();
			var n = this,
				o = this.getOwnerComponent().getModel();
			o.read("/MaterialBarcodeSet('" + t + "')", {
				success: function (e) {
					Z = e.Matnr;
					r.hide();
					n._readMaterials()
				},
				error: function (e) {
					s.show(n.getOwnerComponent().getModel("i18n").getResourceBundle().getText("MaterialNotFound"));
					r.hide()
				}
			})
		},
		onClearFilter: function () {
			Z = "";
			this._readMaterials()
		},
		onLessItem: function (e) {
			var t = this.getView().getModel("oMaterial").getData();
			var n = e.getSource().oPropagatedProperties.oBindingContexts.oMaterial.sPath.slice(1);
			t[n].ZzvenFilled = t[n].ZzvenFilled - 1;
			t[n].ZzvenFilled < 0 && (t[n].ZzvenFilled = 0);
			t[n].ZzvenCurrent = Number(t[n].ZzvenCap) - Number(t[n].ZvenEmtyied) + Number(t[n].ZvenBad) - Number(t[n].ZzvenFilled);
			t[n].ZzvenCurrent = t[n].ZzvenCurrent.toString();
			this.getView().getModel("oMaterial").setData(t)
		},
		onAddItem: function (e) {
			var t = this.getView().getModel("oMaterial").getData();
			var n = e.getSource().oPropagatedProperties.oBindingContexts.oMaterial.sPath.slice(1);
			t[n].ZvenEmtyied = t[n].ZvenEmtyied - 1;
			if (Number(t[n].ZvenEmtyied) < 0) {
				t[n].ZvenEmtyied = 0
			}
			t[n].ZzvenFilled = +t[n].ZzvenFilled + 1;
			if (Number(t[n].ZzvenFilled) > Number(t[n].VehcStock)) {
				t[n].ZzvenFilled = t[n].VehcStock
			}
			if (Number(t[n].ZzvenFilled) > Number(t[n].ZzvenCap)) {
				t[n].ZzvenFilled = t[n].ZzvenCap
			}
			t[n].ZzvenCurrent = Number(t[n].ZzvenCap) - Number(t[n].ZvenEmtyied) + Number(t[n].ZvenBad) - Number(t[n].ZzvenFilled);
			t[n].ZzvenCurrent = t[n].ZzvenCurrent.toString();
			this.getView().getModel("oMaterial").setData(t)
		},
		onEditMachine: function (e) {
			var t = this.getView().getModel("oMaterial").getData();
			var n = e.getSource().oPropagatedProperties.oBindingContexts.oMaterial.sPath.slice(1);
			debugger;
			var i = t[n].ZzvenMatnr + "#" + t[n].Maktx + "#" + t[n].ZzvenCurrent + "#" + t[n].ZzvenFilled + "#" + t[n].ZvenEmtyied + "#" + t[n]
				.ZvenBad + "#" + t[n].ZzvenLast + "#" + 0 + "#" + t[n].ZzvenCap + "#" + t[n].ZzvenMeins + "#" + t[n].ZvenReturn;
			o.getRouterFor(this).navTo("MachineSocket", {
				trip: g,
				ino: u,
				location: v,
				machine: c,
				control: p,
				detail: i
			})
		},
		onConfirmSaveItems: function () {
			if (!this.oApproveDialog) {
				this.oApproveDialog = new sap.m.Dialog({
					type: sap.m.DialogType.Message,
					title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmTitle"),
					content: new sap.m.Text({
						text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmSaveItems")
					}),
					beginButton: new sap.m.Button({
						type: sap.m.ButtonType.Emphasized,
						text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmBtn"),
						press: function () {
							this.oApproveDialog.close();
							this.onSaveItems()
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
				this.onConfirmSaveItems()
			}
		},
		onSaveItems: function () {
			debugger;
			r.show();
			var e = this,
				t = this.getOwnerComponent().getModel(),
				n = this.getView().getModel("oMaterial").getData();
			n.forEach(function (t) {
				t.ZzvenFilled = e._setZeroTheInitial(t.ZzvenFilled);
				t.ZzvenLast = e._setZeroTheInitial(t.ZzvenLast);
				t.ZvenEmtyied = e._setZeroTheInitial(t.ZvenEmtyied);
				t.ZzvenCurrent = e._setZeroTheInitial(t.ZzvenCurrent);
				t.ZvenBad = e._setZeroTheInitial(t.ZvenBad);
				t.ZvenReturn = e._setZeroTheInitial(t.ZvenReturn);
				delete t.__metadata;
				if (t.VehcStock <= "0") {
					t.ZzvenFilled = "0"
				}
				t.ZzvenFilled = t.ZzvenFilled.toString();
				t.ZzvenLast = t.ZzvenLast.toString();
				t.ZvenEmtyied = t.ZvenEmtyied.toString();
				t.ZzvenCurrent = t.ZzvenCurrent.toString();
				t.ZvenBad = t.ZvenBad.toString();
				t.ZvenReturn = t.ZvenReturn.toString()
			});
			var o = {
				Zztrip: g,
				ZztripIno: u,
				ZztripLocation: v,
				ZztripVendmac: c,
				Machine: n
			};
			t.create("/LocationSet", o, {
				success: function (t) {
					r.hide();
					var n = [{
						Type: "S",
						Message: e.getOwnerComponent().getModel("i18n").getResourceBundle().getText("UploadComplete")
					}];
					e.showMessages(n)
				},
				error: function (t) {
					s.show(e.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"));
					r.hide()
				}
			})
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
							this.onClearFilter();
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
		showMessages: function (e) {
			var t = [];
			var n = e;
			for (var o = 0; o < n.length; o++) {
				var i = n[o];
				var a = {
					MessageType: i.Type,
					Message: i.Message
				};
				t.push(a)
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
			this.onNavBack()
		},
		_setZeroTheInitial: function (e) {
			var t = e;
			if (e === null || e === "" || e === " " || e === undefined) {
				t = "0"
			}
			return t
		},
		onNavBack: function () {
			if ( simple === 'X' ) {
				o.getRouterFor(this).navTo("MachineDetailBarcode", {
					trip: g,
					ino: u,
					location: v,
					machine: c,
					control: p,
					detail: 1,
					simple: 'X'
				})
			} else {
				o.getRouterFor(this).navTo("MachineDetail", {
					trip: g,
					ino: u,
					location: v,
					machine: c,
					control: p,
					detail: 1,
					simple: ' '
				})
			}
		}
	})
});
sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/library", "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator", "../model/formatter", "sap/ui/core/UIComponent", "sap/ui/core/BusyIndicator", "sap/m/MessageToast"
], function (e, t, r, s, a, i, l, n, o) {
	"use strict";
	var d;
	var u;
	var g;
	var M;
	var p, m;
	var h = {
		Matnr: "",
		Maktx: "",
		IadeMktr: "",
		IadeBrm: "",
		ArcStkMktr: "",
		ArcStkBrm: "",
		ArcStkMktrBrm: "",
		MatnrMaktx: ""
	};
	return e.extend("app.DzyOtomat.controller.ReturnStock", {
		formatter: i,
		onInit: function () {
			debugger;
			M = new sap.ui.model.json.JSONModel;
			var e = new t;
			this.getView().setModel(e, "iademalzemeListModel");
			this.getView().getModel("iademalzemeListModel").setProperty("/malzemeList", []);
			g = "";
			var r = l.getRouterFor(this);
			r.getRoute("ReturnStock").attachMatched(this._onObjectMatched, this)
		},
		_onObjectMatched: function (e) {
			this.getView().getModel("iademalzemeListModel").setProperty("/malzemeList", []);
			this.getView().byId("tumuruneklebtn").setEnabled(true);
			var t = e.getParameter("arguments");
			p = t.trip;
			m = t.plate
		},
		urunEklePress: function (e) {
			var t = "";
			var r = this.getView();
			if (!this._helpUrunEkle) {
				this._helpUrunEkle = sap.ui.xmlfragment("app.DzyOtomat.view.fragments.depoIade.UrunEkle", this);
				r.addDependent(this._helpUrunEkle);
				this._helpUrunEkle.open()
			} else {
				r.addDependent(this._helpUrunEkle);
				this._helpUrunEkle.open()
			}
		},
		onKapatUrunEkle: function () {
			this.refreshUrunEkleFrg();
			this._helpUrunEkle.close()
		},
		tumurunEklePress: function (e) {
			debugger;
			var t = this;
			var r = this;
			var s = "";
			var a = this.getOwnerComponent().getModel("ARAC");
			var i = [];
			i.push(new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.Contains, s));
			a.read("/DepoIadeMaterialListSet", {
				filters: i,
				success: function (e, s) {
					var a = [];
					e.results.forEach(function (e) {
						a.push({
							Matnr: e.Matnr,
							Maktx: e.Maktx,
							IadeMktr: e.ArcStkMktr,
							IadeBrm: e.ArcStkBrm,
							ArcStkMktr: e.ArcStkMktr,
							ArcStkBrm: e.ArcStkBrm,
							AracStkMktrBrm: e.ArcStkMktrBrm,
							MatnrMaktx: e.MatnrMaktx
						})
					});
					t.getView().getModel("iademalzemeListModel").setData({
						malzemeList: a
					});
					r.getView().byId("tumuruneklebtn").setEnabled(false);
					sap.ui.core.BusyIndicator.hide()
				},
				error: function (e) {
					sap.ui.core.BusyIndicator.hide()
				}
			})
		},
		bindView: function () {
			M.setData({
				malzemeList: d
			});
			this.getView().setModel(M, "malzemeListModel")
		},
		tumunuSilPress: function (e) {
			this.getView().getModel("iademalzemeListModel").setData({
				malzemeList: []
			});
			this.getView().byId("tumuruneklebtn").setEnabled(true)
		},
		onUEkleMlzNo: function (e) {
			var t = this.getView();
			if (!this._helpMlzList) {
				this._helpMlzList = sap.ui.xmlfragment("app.DzyOtomat.view.fragments.depoIade.MlzList", this);
				t.addDependent(this._helpMlzList);
				this._helpMlzList.open()
			} else {
				t.addDependent(this._helpMlzList);
				this._helpMlzList.open()
			}
		},
		CloseMlzList: function () {
			this._helpMlzList.destroy();
			this._helpMlzList = undefined;
			this._helpMlzList.close()
		},
		ConfirmMlzEkle: function (e) {
			var t = e.getParameter("selectedContexts");
			var r = t[0].getProperty("Matnr");
			sap.ui.getCore().byId("UEkleMlzNo2").setValue(r);
			var s = t[0].getProperty("Maktx");
			sap.ui.getCore().byId("UEkleMlzAck2").setText(s);
			var a = t[0].getProperty("ArcStkMktrBrm");
			sap.ui.getCore().byId("UEkleArcStk2").setText(a);
			var i = t[0].getProperty("ArcStkMktrBrm");
			i = i.split(" ")[1];
			sap.ui.getCore().byId("UEkleIadeBrm2").setText(i);
			this._helpMlzList.destroy();
			this._helpMlzList = undefined
		},
		searchMlz: function (e) {
			debugger;
			var t = e.getParameter("value");
			var r = [new s({
				filters: [new s("Matnr", a.Contains, t)]
			})];
			var i = sap.ui.getCore().byId("MlzListTableId2");
			var l = i.getBinding("items");
			l.filter(r)
		},
		onKaydetUrunEkle: function (e) {
			debugger;
			var t = this;
			if (sap.ui.getCore().byId("UEkleIadeMik2").getValue() === "" || sap.ui.getCore().byId("UEkleMlzNo2").getValue() === "") {
				sap.m.MessageBox.error("T�m zorunlu alanlar� doldurunuz")
			} else {
				h = {
					Matnr: sap.ui.getCore().byId("UEkleMlzNo2").getValue(),
					Maktx: sap.ui.getCore().byId("UEkleMlzAck2").getText(),
					IadeMktr: sap.ui.getCore().byId("UEkleIadeMik2").getValue(),
					IadeBrm: sap.ui.getCore().byId("UEkleIadeBrm2").getText(),
					ArcStkMktr: "",
					ArcStkBrm: "",
					MatnrMaktx: ""
				};
				var r = this.getView().getModel("iademalzemeListModel").getProperty("/malzemeList");
				var s = r.filter(function (e, t) {
					return e.Matnr === sap.ui.getCore().byId("UEkleMlzNo2").getValue()
				});
				if (s.length >= 1) {
					o.show(t.getOwnerComponent().getModel("i18n").getResourceBundle().getText("MaterialJustAdded"))
				} else {
					r.push(h);
					this.getView().getModel("iademalzemeListModel").setProperty("/malzemeList", r);
					this.getView().byId("tumuruneklebtn").setEnabled(false);
					this.refreshUrunEkleFrg();
					this._helpUrunEkle.close()
				}
			}
		},
		removeFrmTable: function (e) {
			var t = this.getView().getModel("iademalzemeListModel").getProperty("/malzemeList");
			var r = e.oSource.oPropagatedProperties.oBindingContexts.iademalzemeListModel.sPath.slice(13);
			t.splice(r, 1);
			this.getView().getModel("iademalzemeListModel").setProperty("/malzemeList", t);
			if (t.length === 0) {
				this.getView().byId("tumuruneklebtn").setEnabled(true)
			}
			g = "X";
			this.onPressItem()
		},
		onPressItem: function (e) {
			debugger;
			if (g == !"X") {
				var t = this.getView().getModel("iademalzemeListModel").getProperty("/malzemeList");
				var r = e.getSource().oBindingContexts.iademalzemeListModel.sPath.slice(13);
				var s = t[r];
				var a = this;
				var i = a.getView();
				var l = "";
				if (!this._helpUrunDuzenle) {
					this._helpUrunDuzenle = sap.ui.xmlfragment("app.DzyOtomat.view.fragments.depoIade.UrunDuzenle", this);
					i.addDependent(this._helpUrunDuzenle);
					this._helpUrunDuzenle.open();
					sap.ui.getCore().byId("UEkleMlzNoDzn2").setText(s.Matnr);
					sap.ui.getCore().byId("UEkleMlzAckDzn2").setText(s.Maktx);
					if (s.IadeMktr.split(".")[1] === "000") {
						s.IadeMktr = s.IadeMktr.split(".")[0]
					} else {
						l = s.IadeMktr.split(".")[1];
						if (l === undefined) {
							s.IadeMktr = s.IadeMktr.split(".")[0]
						} else {
							s.IadeMktr = s.IadeMktr.split(".")[0] + "," + l
						}
					}
					sap.ui.getCore().byId("UEkleIadeMikDzn2").setValue(s.IadeMktr);
					sap.ui.getCore().byId("UEkleIadeBrmDzn2").setText(s.IadeBrm)
				} else {
					i.addDependent(this._helpUrunDuzenle);
					this._helpUrunDuzenle.open();
					sap.ui.getCore().byId("UEkleMlzNoDzn2").setText(s.Matnr);
					sap.ui.getCore().byId("UEkleMlzAckDzn2").setText(s.Maktx);
					if (s.IadeMktr.split(".")[1] === "000") {
						s.IadeMktr = s.IadeMktr.split(".")[0]
					} else {
						l = s.IadeMktr.split(".")[1];
						if (l === undefined) {
							s.IadeMktr = s.IadeMktr.split(".")[0]
						} else {
							s.IadeMktr = s.IadeMktr.split(".")[0] + "," + l
						}
					}
					sap.ui.getCore().byId("UEkleIadeMikDzn2").setValue(s.IadeMktr);
					sap.ui.getCore().byId("UEkleIadeBrmDzn2").setText(s.IadeBrm)
				}
			}
			g = ""
		},
		onKaydetUrunDzn: function (e) {
			debugger;
			var t;
			if (sap.ui.getCore().byId("UEkleIadeMikDzn2").getValue() === "" || sap.ui.getCore().byId("UEkleMlzNoDzn2").getText() === "") {
				sap.m.MessageBox.error("T�m zorunlu alanlar� doldurunuz")
			} else {
				var r = sap.ui.getCore().byId("UEkleMlzNoDzn2").getText();
				var s = this.getView().getModel("iademalzemeListModel").getProperty("/malzemeList");
				var a = s.filter(function (e, s) {
					if (e.Matnr === r) {
						t = s
					}
					return e.Matnr === r
				});
				a[0].IadeMktr = sap.ui.getCore().byId("UEkleIadeMikDzn2").getValue();
				s.splice(t, 1, a[0]);
				this.getView().getModel("iademalzemeListModel").setProperty("/malzemeList", s);
				this.refreshUrunDuzenleFrg();
				this._helpUrunDuzenle.close()
			}
		},
		onKapatUrunDzn: function () {
			this.refreshUrunDuzenleFrg();
			this._helpUrunDuzenle.close()
		},
		refreshUrunDuzenleFrg: function (e) {
			sap.ui.getCore().byId("UEkleMlzNoDzn2").setText("");
			sap.ui.getCore().byId("UEkleMlzAckDzn2").setText("");
			sap.ui.getCore().byId("UEkleIadeMikDzn2").setValue("");
			sap.ui.getCore().byId("UEkleIadeBrmDzn2").setText("")
		},
		refreshUrunEkleFrg: function (e) {
			sap.ui.getCore().byId("UEkleMlzNo2").setValue("");
			sap.ui.getCore().byId("UEkleMlzAck2").setText("");
			sap.ui.getCore().byId("UEkleArcStk2").setText("");
			sap.ui.getCore().byId("UEkleIadeMik2").setValue("");
			sap.ui.getCore().byId("UEkleIadeBrm2").setText("")
		},
		kaydetPress: function (e) {
			debugger;
			var t = this;
			var r = this.getView().getModel("iademalzemeListModel").getProperty("/malzemeList");
			var s = JSON.stringify(r);
			var a = this.getView(),
				i = a.getModel("ARAC"),
				l = this;
			i.callFunction("/DIadeKaydetFI", {
				method: "GET",
				urlParameters: {
					ivtablevalues: s
				},
				success: function (e, r) {
					debugger;
					var s = e.results.filter(function (e, t) {
						return e.Type === "S"
					});
					if (s.length >= 1) {
						t.getView().getModel("iademalzemeListModel").setProperty("/malzemeList", [])
					}
					n.hide();
					t.showMessages(e)
				},
				error: function (e) {
					debugger;
					sap.m.MessageBox.error(e.responseText);
					n.hide()
				}
			})
		},
		showMessages: function (e) {
			debugger;
			var t = this;
			var r = [];
			var s = e.results;
			for (var a = 0; a < s.length; a++) {
				var i = s[a];
				var l = {
					MessageType: i.Type,
					Message: i.Message
				};
				r.push(l)
			}
			u = new sap.ui.model.json.JSONModel;
			this.getView().setModel(u, "oMsgModel");
			this.getView().getModel("oMsgModel").setData(r);
			if (!this.oMessage) {
				this.oMessage = sap.ui.xmlfragment("app.DzyOtomat.view.fragments.depoIade.Messages", this);
				this.getView().addDependent(this.oMessage)
			}
			this.oMessage.open();
			this.getOwnerComponent().getModel("oMsgModel").refresh(true)
		},
		onMessageClose: function () {
			this.oMessage.close()
		},
		onNavBack: function (e) {
			this.getView().getModel("iademalzemeListModel").setProperty("/malzemeList", []);
			this.getView().byId("tumuruneklebtn").setEnabled(true);
			var t = this.getOwnerComponent().getRouter();
			t.navTo("Trips", {
				trip: p,
				ino: m
			})
		}
	})
});
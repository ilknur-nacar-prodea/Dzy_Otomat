sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/library", "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator", "sap/ui/core/UIComponent", "sap/ui/core/BusyIndicator", "../model/formatter", "sap/m/MessageToast"
], function (e, t, r, s, a, i, l, o, n) {
	"use strict";
	var u;
	var d;
	var g, M;
	var p;
	var k;
	var m = {
		Matnr: "",
		Maktx: "",
		Mktr: "",
		Brm: "",
		ArcStkMktr: "",
		ArcStkBrm: "",
		ArcStkMktrBrm: "",
		MatnrMaktx: "",
		Charg: "",
		Lgnum: "",
		Lgpla: "",
		Lgtyp: "",
		Lqnum: ""
	};
	return e.extend("app.DzyOtomat.controller.Convert2Damaged", {
		formatter: o,
		onInit: function () {
			k = new sap.ui.model.json.JSONModel;
			var e = new t;
			this.getView().setModel(e, "convert2DamMatListModel");
			this.getView().getModel("convert2DamMatListModel").setProperty("/malzemeList", []);
			p = "";
			var r = i.getRouterFor(this);
			r.getRoute("Convert2Damaged").attachMatched(this._onObjectMatchedDetail, this)
		},
		_onObjectMatched: function (e) {
			this.getView().getModel("convert2DamMatListModel").setProperty("/malzemeList", []);
			this.getView().byId("tumuruneklebtn").setEnabled(true);
			var t = e.getParameter("arguments");
			g = t.trip;
			M = t.plate
		},
		urunEklePress: function (e) {
			var t = "";
			var r = this.getView();
			if (!this._helpUrunEkle) {
				this._helpUrunEkle = sap.ui.xmlfragment("app.DzyOtomat.view.fragments.convert2Damaged.UrunEkle", this);
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
			// a.read("/DepoIadeMaterialListSet", {
				a.read("/Convert2DamMalListSet", {
				filters: i,
				success: function (e, s) {
					u = e.results;
					r.bindView();
					if (u.length > 0) {
						var a = [];
						for (var i = 0; i < e.results.length; i++) {
							m = {
								Matnr: e.results[i].Matnr,
								Maktx: e.results[i].Maktx,
								Mktr: e.results[i].ArcStkMktr,
								Brm: e.results[i].ArcStkBrm,
								ArcStkMktr: e.results[i].ArcStkMktr,
								ArcStkBrm: e.results[i].ArcStkBrm,
								ArcStkMktrBrm: e.results[i].ArcStkMktrBrm,
								MatnrMaktx: e.results[i].MatnrMaktx,
								Charg: e.results[i].Charg,
								Lgnum: e.results[i].Lgnum,
								Lgpla: e.results[i].Lgpla,
								Lgtyp: e.results[i].Lgtyp,
								Lqnum: e.results[i].Lqnum
							};
							a.push(m)
						}
						t.getView().getModel("convert2DamMatListModel").setData({
							malzemeList: a
						})
					}
					r.getView().byId("tumuruneklebtn").setEnabled(false);
					sap.ui.core.BusyIndicator.hide()
				},
				error: function (e) {
					sap.ui.core.BusyIndicator.hide()
				}
			})
		},
		bindView: function () {
			var e = new sap.ui.model.json.JSONModel;
			e.setData({
				malzemeList: u
			});
			this.getView().setModel(e, "malzemeListModel")
		},
		tumunuSilPress: function (e) {
			this.getView().getModel("convert2DamMatListModel").setProperty("/malzemeList", []);
			this.getView().byId("tumuruneklebtn").setEnabled(true)
		},
		onUEkleMlzNo: function (e) {
			var t = this.getView();
			if (!this._helpMlzList) {
				this._helpMlzList = sap.ui.xmlfragment("app.DzyOtomat.view.fragments.convert2Damaged.MlzList", this);
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
			sap.ui.getCore().byId("UEkleMlzNo5").setValue(r);
			var s = t[0].getProperty("Maktx");
			sap.ui.getCore().byId("UEkleMlzAck5").setText(s);
			var a = t[0].getProperty("ArcStkMktrBrm");
			sap.ui.getCore().byId("UEkleArcStk5").setText(a);
			var i = t[0].getProperty("ArcStkMktrBrm");
			i = i.split(" ")[0];
			sap.ui.getCore().byId("UEkleMik5").setValue(i);
			var l = t[0].getProperty("ArcStkMktrBrm");
			l = l.split(" ")[1];
			sap.ui.getCore().byId("UEkleBrm5").setText(l);

			var Charg = t[0].getProperty("Charg");
			sap.ui.getCore().byId("UEkleCharg5").setText(Charg);
			var Lqnum = t[0].getProperty("Lqnum");
			sap.ui.getCore().byId("UEkleLqnum5").setText(Lqnum);
			var Lgtyp = t[0].getProperty("Lgtyp");
			sap.ui.getCore().byId("UEkleLgtyp5").setText(Lgtyp);
			var Lgpla = t[0].getProperty("Lgpla");
			sap.ui.getCore().byId("UEkleLgpla5").setText(Lgpla);
			var Lgnum = t[0].getProperty("Lgnum");
			sap.ui.getCore().byId("UEkleLgnum5").setText(Lgnum);

			this._helpMlzList.destroy();
			this._helpMlzList = undefined
		},
		searchMlz: function (e) {
			debugger;
			var t = e.getParameter("value");
			var r = [new s({
				filters: [new s("Matnr", a.Contains, t)]
			})];
			var i = sap.ui.getCore().byId("MlzListTableId5");
			var l = i.getBinding("items");
			l.filter(r)
		},
		onKaydetUrunEkle: function (e) {
			debugger;
			if (sap.ui.getCore().byId("UEkleMik5").getValue() === "" || sap.ui.getCore().byId("UEkleMlzNo5").getValue() === "") {
				sap.m.MessageBox.error("{i18n>FillAllRequired}")
			} else {
				m = {
					Matnr: sap.ui.getCore().byId("UEkleMlzNo5").getValue(),
					Maktx: sap.ui.getCore().byId("UEkleMlzAck5").getText(),
					Mktr: sap.ui.getCore().byId("UEkleMik5").getValue(),
					Brm: sap.ui.getCore().byId("UEkleBrm5").getText(),
					ArcStkMktr: "",
					ArcStkBrm: "",
					MatnrMaktx: "",
					Charg: sap.ui.getCore().byId("UEkleCharg5").getText(),
					Lgnum: sap.ui.getCore().byId("UEkleLgnum5").getText(),
					Lgpla: sap.ui.getCore().byId("UEkleLgpla5").getText(),
					Lgtyp: sap.ui.getCore().byId("UEkleLgtyp5").getText(),
					Lqnum: sap.ui.getCore().byId("UEkleLqnum5").getText()
				};
				var t = this.getView().getModel("convert2DamMatListModel").getProperty("/malzemeList");
				var r = t.filter(function (e, t) {
					return e.Matnr === sap.ui.getCore().byId("UEkleMlzNo5").getValue()
				});
				if (r.length >= 1) {
					n.show(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("MaterialJustAdded"))
				} else {
					t.push(m);
					this.getView().getModel("convert2DamMatListModel").setProperty("/malzemeList", t);
					this.getView().byId("tumuruneklebtn").setEnabled(false);
					this.refreshUrunEkleFrg();
					this._helpUrunEkle.close()
				}
			}
		},
		removeFrmTable: function (e) {
			var t = this.getView().getModel("convert2DamMatListModel").getProperty("/malzemeList");
			var r = e.oSource.oPropagatedProperties.oBindingContexts.convert2DamMatListModel.sPath.slice(13);
			t.splice(r, 1);
			this.getView().getModel("convert2DamMatListModel").setProperty("/malzemeList", t);
			if (t.length === 0) {
				this.getView().byId("tumuruneklebtn").setEnabled(true)
			}
			p = "X";
			this.onPressItem()
		},
		onPressItem: function (e) {
			debugger;
			if (p == !"X") {
				var t = this.getView().getModel("convert2DamMatListModel").getProperty("/malzemeList");
				var r = e.getSource().oBindingContexts.convert2DamMatListModel.sPath.slice(13);
				var s = t[r];
				var a = this;
				var i = a.getView();
				var l = "";
				if (!this._helpUrunDuzenle) {
					this._helpUrunDuzenle = sap.ui.xmlfragment("app.DzyOtomat.view.fragments.convert2Damaged.UrunDuzenle", this);
					i.addDependent(this._helpUrunDuzenle);
					this._helpUrunDuzenle.open();
					sap.ui.getCore().byId("UEkleMlzNoDzn5").setText(s.Matnr);
					sap.ui.getCore().byId("UEkleMlzAckDzn5").setText(s.Maktx);
					if (s.Mktr.split(".")[1] === "000") {
						s.Mktr = s.Mktr.split(".")[0]
					} else {
						l = s.Mktr.split(".")[1];
						if (l === undefined) {
							s.Mktr = s.Mktr.split(".")[0]
						} else {
							s.Mktr = s.Mktr.split(".")[0] + "," + l
						}
					}
					sap.ui.getCore().byId("UEkleMikDzn5").setValue(s.Mktr);
					sap.ui.getCore().byId("UEkleBrmDzn5").setText(s.Brm)
				} else {
					i.addDependent(this._helpUrunDuzenle);
					this._helpUrunDuzenle.open();
					sap.ui.getCore().byId("UEkleMlzNoDzn5").setText(s.Matnr);
					sap.ui.getCore().byId("UEkleMlzAckDzn5").setText(s.Maktx);
					if (s.Mktr.split(".")[1] === "000") {
						s.Mktr = s.Mktr.split(".")[0]
					} else {
						l = s.Mktr.split(".")[1];
						if (l === undefined) {
							s.Mktr = s.Mktr.split(".")[0]
						} else {
							s.Mktr = s.Mktr.split(".")[0] + "," + l
						}
					}
					sap.ui.getCore().byId("UEkleMikDzn5").setValue(s.Mktr);
					sap.ui.getCore().byId("UEkleBrmDzn5").setText(s.Brm)
				}
			}
			p = ""
		},
		onKaydetUrunDzn: function (e) {
			debugger;
			var t;
			if (sap.ui.getCore().byId("UEkleMikDzn5").getValue() === "" || sap.ui.getCore().byId("UEkleMlzNoDzn5").getText() === "") {
				sap.m.MessageBox.error("{i18n>FillAllRequired}")
			} else {
				var r = sap.ui.getCore().byId("UEkleMlzNoDzn5").getText();
				var s = this.getView().getModel("convert2DamMatListModel").getProperty("/malzemeList");
				var a = s.filter(function (e, s) {
					if (e.Matnr === r) {
						t = s
					}
					return e.Matnr === r
				});
				a[0].Mktr = sap.ui.getCore().byId("UEkleMikDzn5").getValue();
				s.splice(t, 1, a[0]);
				this.getView().getModel("convert2DamMatListModel").setProperty("/malzemeList", s);
				this.refreshUrunDuzenleFrg();
				this._helpUrunDuzenle.close()
			}
		},
		onKapatUrunDzn: function () {
			this.refreshUrunDuzenleFrg();
			this._helpUrunDuzenle.close()
		},
		refreshUrunDuzenleFrg: function (e) {
			sap.ui.getCore().byId("UEkleMlzNoDzn5").setText("");
			sap.ui.getCore().byId("UEkleMlzAckDzn5").setText("");
			sap.ui.getCore().byId("UEkleMikDzn5").setValue("");
			sap.ui.getCore().byId("UEkleBrmDzn5").setText("")
		},
		refreshUrunEkleFrg: function (e) {
			sap.ui.getCore().byId("UEkleMlzNo5").setValue("");
			sap.ui.getCore().byId("UEkleMlzAck5").setText("");
			sap.ui.getCore().byId("UEkleArcStk5").setText("");
			sap.ui.getCore().byId("UEkleMik5").setValue("");
			sap.ui.getCore().byId("UEkleBrm5").setText("");
			sap.ui.getCore().byId("UEkleCharg5").setText("");
			sap.ui.getCore().byId("UEkleLgnum5").setText("");
			sap.ui.getCore().byId("UEkleLgpla5").setText("");
			sap.ui.getCore().byId("UEkleLgtyp5").setText("");
			sap.ui.getCore().byId("UEkleLqnum5").setText("");
		},
		kaydetPress: function (e) {
			debugger;
			var t = [];
			var r = this;
			t = this.getView().getModel("convert2DamMatListModel").getProperty("/malzemeList");
			var s = JSON.stringify(t);
			var a = this.getView(),
				i = a.getModel("ARAC"),
				o = this;
			i.callFunction("/Convert2DamagedSaveFI", {
				method: "GET",
				urlParameters: {
					ivtablevalues: s
				},
				success: function (e, t) {
					debugger;
					var s = e.results.filter(function (e, t) {
						return e.Type === "S"
					});
					if (s.length >= 1) {
						r.getView().getModel("convert2DamMatListModel").setProperty("/malzemeList", [])
					}
					l.hide();
					r.showMessages(e)
				},
				error: function (e) {
					debugger;
					sap.m.MessageBox.error(e.responseText);
					l.hide()
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
			d = new sap.ui.model.json.JSONModel;
			this.getView().setModel(d, "oMsgModel");
			this.getView().getModel("oMsgModel").setData(r);
			if (!this.oMessage) {
				this.oMessage = sap.ui.xmlfragment("app.DzyOtomat.view.fragments.convert2Damaged.Messages", this);
				this.getView().addDependent(this.oMessage)
			}
			this.oMessage.open();
			this.getOwnerComponent().getModel("oMsgModel").refresh(true)
		},
		onMessageClose: function () {
			this.oMessage.close()
		},
		onNavBack: function (e) {
			this.getView().getModel("convert2DamMatListModel").setProperty("/malzemeList", []);
			this.getView().byId("tumuruneklebtn").setEnabled(true);
			var t = this.getOwnerComponent().getRouter();
			t.navTo("Trips", {
				trip: g,
				ino: M
			})
		}
	})
});
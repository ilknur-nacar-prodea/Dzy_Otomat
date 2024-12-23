sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/ui/core/UIComponent",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/BusyIndicator", "sap/m/MessageToast", "sap/m/library", "sap/m/Dialog",
	"sap/ui/Device", "sap/m/upload/Uploader"
], function (e, t, o, n, i, a, s, r, g, l, d, p) {
	"use strict";
	var c = "environment";
	var u, m, h, v, f, w;
	var simple;
	return e.extend("app.DzyOtomat.controller.UploadImage", {
		formatter: o,
		onInit: function () {
			var e = n.getRouterFor(this);
			e.getRoute("UploadImage").attachMatched(this._onObjectMatchedDetail, this)
		},
		_onObjectMatchedDetail: function (e) {
			var t = e.getParameter("arguments");
			u = t.trip;
			m = t.ino;
			h = t.location;
			v = t.machine;
			f = t.control;
			simple = t.simple;
			var o = this.getView().byId("image");
			o.setSrc()
		},
		onConfirmSaveImg: function () {
			var e = this.getView().byId("image");
			var t = e.getSrc();
			if (t === "") {
				r.show(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("UploadImgErr"));
				return
			}
			if (!this.oApproveDialog) {
				this.oApproveDialog = new sap.m.Dialog({
					type: sap.m.DialogType.Message,
					title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmTitle"),
					content: new sap.m.Text({
						text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmSaveImg")
					}),
					beginButton: new sap.m.Button({
						type: sap.m.ButtonType.Emphasized,
						text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ConfirmBtn"),
						press: function () {
							this.oApproveDialog.close();
							this.onSaveImage()
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
				this.onConfirmSaveImg()
			}
		},
		onSaveImage: function () {
			var e = this.getView().byId("image");
			var t = e.getImageJpegDataURL(.5);
			var o = t.slice(23);
			var n = t.split(";")[0].split("/")[1].toUpperCase();
			var i = this,
				a = this.getView().getModel();
			s.show();
			a.callFunction("/SaveImage", {
				method: "GET",
				urlParameters: {
					trip: u,
					ino: m,
					location: h,
					machine: v,
					image: o,
					extension: n
				},
				success: function (e) {
					s.hide();
					var t = e.results.filter(function (e) {
						return e.Type === "E"
					}).length > 0;
					if (!t) {
						i.onClearContainer()
					}
					i.getView().getModel("oGlobalModel").setData({
						sessionImageUpload: true
					});
					i.showMessages(e.results)
				},
				error: function (e) {
					r.show(i.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ServiceUnavailable"));
					s.hide()
				}
			})
		},
		onUploadChange: function (e) {
			var t = e.getParameter("files")[0],
				o = this.getView().byId("image");
			if (!t) {
				return
			}
			o.setSrc(t)
		},
		onImageLoaded: function () {
			var e = this.getView().byId("image");
			if (e.getSrc() !== "") {
				var t = e.getHeight();
				var o = e.getWidth();
				if (o > 350) {
					var n = t / o;
					o = 350;
					t = n * o;
					e.setHeight(t);
					e.setWidth(o)
				}
			}
		},
		onClearContainer: function (e) {
			var t = this.getView().byId("image");
			t.setSrc();
			var o = this.getView().byId("IdUploader");
			o.setValue()
		},
		onTakePicture: function () {
			var e = this;
			e.fixedDialog = new l({
				title: "Foto�raf �ekmek i�in t�klay�n�z",
				content: [new sap.ui.core.HTML({
					content: "<video id='player' autoplay/>"
				})],
				buttons: [new sap.m.Button({
					text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ChangeCam"),
					icon: "sap-icon://it-system",
					press: function () {
						c === "environment" ? c = "user" : c = "environment";
						navigator.mediaDevices.getUserMedia({
							video: {
								facingMode: c
							}
						}).then(function (e) {
							w = e;
							player.srcObject = e
						})
					}
				}), new sap.m.Button({
					text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("TakePicture"),
					press: function () {
						e.imageValue = document.getElementById("player");
						e.imageText = "txt";
						e.setImage();
						e.fixedDialog.close();
						e.fixedDialog.destroy();
						e.fixedDialog = undefined
					}
				}), new sap.m.Button({
					text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("CancelBtn"),
					press: function () {
						w.getTracks().forEach(function (e) {
							e.stop();
							e.enabled = false
						});
						e.fixedDialog.close();
						e.fixedDialog.destroy();
						e.fixedDialog = undefined
					}
				})]
			});
			e.getView().addDependent(this.fixedDialog);
			this.fixedDialog.open();
			w = "";
			var t = function (e) {
				w = e;
				player.srcObject = e
			};
			navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: c
				}
			}).then(t)
		},
		setImage: function () {
			this.getView().byId("IdImgCont").setVisible(true);
			var e = this.getView().byId("image");
			var t = this;
			var o = this.getView().byId("IdImgCont");
			o.removeAllItems();
			var n = o.getItems();
			var i = "archie-" + n.length;
			var a = this.imageText;
			var s = this.imageValue;
			if (s !== undefined) {
				var r = new sap.ui.core.HTML({
					content: "<canvas id='" + i + "'   height='400px' " + " style='2px solid red'></canvas> "
				});
				var g;
				o.addItem(r);
				r.addEventDelegate({
					onAfterRendering: function () {
						g = document.getElementById(i);
						var o = g.getContext("2d");
						o.drawImage(s, 0, 0, g.width, g.height);
						var n = g.toDataURL("image/png");
						e.setSrc(n);
						t.byId("IdImgCont").setVisible(false);
						w.getTracks().forEach(function (e) {
							e.stop();
							e.enabled = false
						})
					}
				})
			}
		},
		showMessages: function (e) {
			var t = [];
			var o = e;
			for (var n = 0; n < o.length; n++) {
				var i = o[n];
				var a = {
					MessageType: i.Type,
					Message: i.Message
				};
				t.push(a)
			}
			var s = new sap.ui.model.json.JSONModel;
			this.getView().setModel(s, "oMsgModel");
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
		onConfirmNavBack: function () {
			var e = this.getView().byId("image");
			var t = e.getSrc();
			if (t === "") {
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
					trip: u,
					ino: m,
					location: h,
					machine: v,
					control: f,
					simple: ' '
				})
			} else {
				n.getRouterFor(this).navTo("MachineDetailBarcode", {
					trip: u,
					ino: m,
					location: h,
					machine: v,
					control: f,
					simple: 'X'
				})
			}
		}
	})
});
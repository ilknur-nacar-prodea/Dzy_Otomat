sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/m/library","sap/ui/model/Filter","sap/ui/model/FilterOperator","../model/formatter","sap/ui/core/UIComponent","sap/ui/core/BusyIndicator"],function(e,t,r,i,a,o,n,s){"use strict";var u,p;return e.extend("app.DzyOtomat.controller.SReport",{onInit:function(){debugger;var e=new t;var r=n.getRouterFor(this);r.getRoute("SReport").attachMatched(this._onObjectMatched,this)},_onObjectMatched:function(e){debugger;this.getView().byId("MaterialTableRep").getBinding("items").refresh(true);var t=e.getParameter("arguments");u=t.trip;p=t.plate},onNavBack:function(){debugger;this.getView().byId("MaterialTableRep").getBinding("items").refresh(true);var e=this.getOwnerComponent().getRouter();e.navTo("Trips",{trip:u,ino:p})}})});
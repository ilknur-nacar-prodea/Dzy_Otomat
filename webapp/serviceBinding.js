function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZDZY_OD_ARAC_UYG_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}
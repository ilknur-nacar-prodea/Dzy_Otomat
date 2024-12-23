sap.ui.define(["sap/ui/core/Control","jquery.sap.global","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/m/ResponsivePopover","sap/m/List","sap/m/DisplayListItem","sap/ui/Device"],function(e,t,o,i,n,s,r,a){"use strict";return e.extend("app.scanner.controls.ExtScanner",{metadata:{manifest:"json",properties:{type:{type:"string",defaultValue:"Multi"},editMode:{type:"boolean",defaultValue:true},settings:{type:"boolean",defaultValue:false},decoderKey:{type:"string",defaultValue:"raw"},decoders:{type:"object",defaultValue:null},tryHarder:{type:"boolean",defaultValue:false},laser:{type:"boolean",defaultValue:false}},events:{valueScanned:{parameters:{value:{type:"string"}}},cancelled:{}}},init:function(){this._oToolbar=null;this._oScanModel=null;this._oTD=null;this._oID=null;this._oBarCodeDecoder=null;this._oQRCodeDecoder=null;this._oScanModel=new o({type:this.getType(),editButton:this.getEditMode(),changeButton:true,value:"",videoDeviceId:null,decoders:this.getDecoders(),decoderKey:this.getDecoderKey(),tryHarder:this.getTryHarder(),settings:this.getSettings()});this.setModel(sap.ui.core.Component.getOwnerComponentFor(this).getModel("i18n"),"i18n");this.setModel(this._oScanModel,"scanModel");this.setModel(new o(a),"device");sap.ui.Device.orientation.attachHandler(this.adaptVideoSourceSize.bind(this))},adaptByOrientationChange:function(){this.adaptVideoSourceSize();this._resetScan()},exit:function(){sap.ui.Device.orientation.detachHandler(this.adaptVideoSourceSize)},setDecoderKey:function(e){if(this._oScanModel){this._oScanModel.setProperty("/decoderKey",e)}this.setProperty("decoderKey",e)},setSettings:function(e){if(this._oScanModel){this._oScanModel.setProperty("/settings",e)}this.setProperty("settings",e)},setTryHarder:function(e){this.setProperty("tryHarder",e,false);if(this._oDecoder){this.resetDecoder()}},setDecoders:function(e){var t=[this.getRawDecoder()];if(e instanceof Array){t=t.concat(e)}if(this._oScanModel){this._oScanModel.setProperty("/decoders",t)}this.setProperty("decoders",t)},getRawDecoder:function(){return{key:"raw",text:"RAW",decoder:function(e){return e?e.text:""}}},open:function(){this.onShowDialog()},setType:function(e){if(e==="Barcode"||e==="QR-Code"||e==="Multi"){this.setProperty("type",e);if(this._oScanModel){this._oScanModel.setProperty("/type",e)}}},onDecoderChanges:function(e){var t=e.getParameter("item");var o=this.getDecoderByKey(t.getKey());if(this.lastScannedResult){var i=o.decoder(this.lastScannedResult)||this.lastScannedResult.text;this._oScanModel.setProperty("/value",i)}if(this.oSettingsPopover){this.oSettingsPopover.close()}},onHarderChange:function(){var e=this._oScanModel.getProperty("/tryHarder");var t=this.getProperty("tryHarder");if(t!==e){this.setTryHarder(e)}if(this.oSettingsPopover){this.oSettingsPopover.close()}},onSettingsPopover:function(e){var t=e.getSource();this.getSettingsPopover().openBy(t)},getSettingsPopover:function(){if(!this.oSettingsPopover){this.oSettingsPopover=sap.ui.xmlfragment(this.getId(),"app.scanner.controls.fragments.settingsPopover",this);this._getScanDialog().addDependent(this.oSettingsPopover)}return this.oSettingsPopover},setEditMode:function(e){var t=this.getProperty("editMode");this.setProperty("editMode",e);if(this._oScanModel){this._oScanModel.setProperty("/editButton",true);if(t!==e){var o=this._getScanDialog();if(e===true){this._addHeader(o)}else{o.setCustomHeader()}}}},onChangePress:function(e){var t=this._oScanModel.getProperty("/videoDevices");if(t&&t.length>1){if(t.length===2){var o=this.getCurrentVideoDevice();t.some(function(e){if(e.deviceId!==o){this.changeDevice(e.deviceId);return true}return false}.bind(this))}else{this.openChangePopover(e.getSource())}}},onChangeDevice:function(e){var t=e.getProperty("listItem");var o=t.getValue();this.getChangePopover().close();this.changeDevice(o)},changeDevice:function(e){this._oScanModel.setProperty("/videoDeviceId",e);this._stopScan();this._startScan()},getChangePopover:function(){if(!this._oChangePopover){var e=new s({mode:"SingleSelectMaster"});e.setModel(this._oScanModel);e.bindItems({path:"/videoDevices",template:new r({value:"{label}"})});this._oChangePopover=new n({class:"sapUiContentPadding",showHeader:false,selectionChange:this.onChangeDevice.bind(this)});this._oChangePopover.addContent(e)}return this._oChangePopover},openChangePopover:function(e){var t=this.getChangePopover();var o=t.getContent()[0];if(o){var i=this.getCurrentVideoDevice();if(i){var n=this._oScanModel.getProperty("/videoDevices").find(function(e){return e.deviceId===i});var s=o.getItems().find(function(e){return e.getValue()===n.label});if(s){o.setSelectedItem(s)}}else{o.removeSelections(true)}}t.openBy(e,false)},getCurrentVideoDevice:function(){var e=this._oScanModel.getProperty("/videoDeviceId");if(!e){if(this._oDecoder&&this._oDecoder.stream){var t=this._oDecoder.stream.getVideoTracks()[0];if(t){var o=t.getCapabilities?t.getCapabilities():t.getSettings();if(o){e=o.deviceId}}}}return e},resetDecoder:function(){this._oScanModel.setProperty("/value","");this.lastScannedResult=null;this._stopScan();this._oBarCodeDecoder=null;this._oQRCodeDecoder=null;this._oMultiCodeDecoder=null;this.initDecoder();this._startScan()},initDecoder:function(){var e=this.getProperty("type");switch(e){case"Barcode":this._oDecoder=this._getBarCodeDecoder();break;case"QR-Code":this._oDecoder=this._getQRCodeDecoder();break;default:this._oDecoder=this._getMultiCodeDecoder()}return this._oDecoder},onShowDialog:function(){this.lastScannedResult=null;this.initDecoder();if(this._oDecoder){this._oDecoder.listVideoInputDevices().then(function(e){this._oScanModel.setProperty("/videoDevices",e);if(e&&e.length){if(e.length===1){this._oScanModel.setProperty("/changeButton",false)}else{this._oScanModel.setProperty("/changeButton",true)}}else{throw new Error("No video devices")}return true}.bind(this)).then(function(){this._showScanDialog()}.bind(this)).catch(function(e){t.sap.log.warning(e);this._showInputDialog()}.bind(this))}},onCancelPress:function(e){var t=e.getSource().getParent();t.close();this.fireCancelled({});this._oScanModel.setProperty("/value","")},onOkPress:function(e){var t=e.getSource().getParent();t.close();this.fireValueScanned({value:this._oScanModel.getProperty("/value")});this._oScanModel.setProperty("/value","")},_getOpenButton:function(){if(!this._oBtn){this._oBtn=new Button(this.createId("idScanOpenDialogBtn"),{icon:"sap-icon://bar-code",press:this.onShowDialog.bind(this)})}return this._oBtn},_getBarCodeDecoder:function(){if(!this._oBarCodeDecoder){this._oBarCodeDecoder=new ZXing.BrowserBarcodeReader(new Map([["TRY_HARDER",this.getTryHarder()]]))}return this._oBarCodeDecoder},_getQRCodeDecoder:function(){if(!this._oQRCodeDecoder){this._oQRCodeDecoder=new ZXing.BrowserQRCodeReader(new Map([["TRY_HARDER",this.getTryHarder()]]))}return this._oQRCodeDecoder},_getMultiCodeDecoder:function(){if(!this._oMultiCodeDecoder){this._oMultiCodeDecoder=new ZXing.BrowserMultiFormatReader(new Map([["TRY_HARDER",this.getTryHarder()]]))}return this._oMultiCodeDecoder},_showInputDialog:function(){this._openDialog(this._getInputDialog())},_showScanDialog:function(){this._openDialog(this._getScanDialog());this.updateLaser();this.adaptVideoSourceSize()},adaptVideoSourceSize:function(){var e=this.getModel("device");var t=e.getProperty("/system/phone");var o=e.getProperty("/orientation/portrait");var i=e.getProperty("/resize/width");var n=e.getProperty("/resize/height");var s;if(t){if(o){n-=96}else{s=n;n=i-96;i=s}}if(t){$('div[id$="videoContainer"]').width(i);$('div[id$="videoContainer"]').height(n)}else{$('div[id$="videoContainer"]').width("100%");$('div[id$="videoContainer"]').height("100%")}},updateLaser:function(){var e=this.getProperty("laser");if(e){$(".scanner-laser").show()}else{$(".scanner-laser").hide()}},_openDialog:function(e){if(this.getModel("device").getProperty("/system/phone")===true){e.setStretch(true)}else{e.setStretch(false)}e.open()},_getScanDialog:function(){if(!this._oTD){this._oTD=sap.ui.xmlfragment(this.getId(),"app.scanner.controls.fragments.scanDialog",this);if(this.getEditMode()===true){this._addHeader(this._oTD)}this._oTD.attachAfterOpen(this._onAfterOpen.bind(this));this._oTD.attachAfterClose(this._onAfterClose.bind(this));this.addDependent(this._oTD)}return this._oTD},_getInputDialog:function(){if(!this._oID){this._oID=sap.ui.xmlfragment(this.getId(),"app.scanner.controls.fragments.inputDialog",this);this.addDependent(this._oID)}return this._oID},_addHeader:function(e){if(e){var t=this._getDialogHeader();e.setCustomHeader(t);e.invalidate()}},_startScan:function(){this._oDecoder.decodeFromVideoDevice(this._oScanModel.getProperty("/videoDeviceId"),this.getId()+"--scanVideo",this._saveScannedValue.bind(this)).catch(function(e){if(e&&e.name&&e.name==="NotAllowedError"){i.show("Video device is blocked")}else{i.show(e.message||"Unexpected error in decoder, switch to input mode")}this._getScanDialog().close();this._showInputDialog();t.sap.log.error(e)}.bind(this))},_stopScan:function(){this._oDecoder.stopContinuousDecode();this._oDecoder.stopAsyncDecode();this._oDecoder.reset()},_onAfterOpen:function(){this._startScan()},_onAfterClose:function(){this._stopScan()},_resetScan:function(){this._stopScan();this._startScan()},onResetScan:function(){this._oScanModel.setProperty("/value","");this.lastScannedResult=null;this._resetScan();if(this.oSettingsPopover){this.oSettingsPopover.close()}},getDecoderByKey:function(e){var t=this._oScanModel.getProperty("/decoders").find(function(t){return t.key===e});return t||this.getRawDecoder()},_saveScannedValue:function(e,o){if(e){this.lastScannedResult=e;var n=this.getDecoderByKey(this._oScanModel.getProperty("/decoderKey"));var s=n.decoder(e)||e.text;this._oScanModel.setProperty("/value",s);if(this.getEditMode()===false){this.fireValueScanned({value:s});this._getScanDialog().close()}else{i.show(s)}}if(o&&!(o instanceof ZXing.NotFoundException)){t.sap.log.warning("Error by decode from video stream (Multi)");t.sap.log.warning(o)}},_getDialogHeader:function(){if(!this._oHeader){this._oHeader=sap.ui.xmlfragment(this.getId(),"app.scanner.controls.fragments.toolbar",this);this._getScanDialog().addDependent(this._oHeader)}return this._oHeader},getTitle:function(e,t){return t==="Multi"?e+" Multiple formats":e+" "+t}})});
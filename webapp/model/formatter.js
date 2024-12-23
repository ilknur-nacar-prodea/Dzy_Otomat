sap.ui.define([], function () {
	"use strict";
	return {
		formatVenNo: function (e) {
			while (e.indexOf(0) === 0) {
				e = e.substring(1)
			}
			return e
		},
		currencyValue: function (e) {
			if (e) {
				var r = e.split(".")[1];
				if (r === "000") {
					return parseFloat(e).toFixed(0)
				} else {
					var t = {
						minIntegerDigits: 1,
						maxIntegerDigits: 10,
						minFractionDigits: 3,
						maxFractionDigits: 3
					};
					var n = sap.ui.core.format.NumberFormat.getFloatInstance(t);
					return n.format(e)
				}
			} else {
				return ""
			}
		},
		currencyValue2: function (e) {
			debugger;
			var r = "";
			if (e) {
				var t = e.split(".")[1];
				var n = e.split(".")[0];
				if (t === "000") {
					r = n;
					return r
				} else {
					debugger;
					r = e;
					return r
				}
			} else {
				return ""
			}
		},
		currencyValue3: function (e) {
			debugger;
			var r = "";
			if (e) {
				var t = e.split(".")[1];
				var n = e.split(".")[0];
				if (t === "000") {
					r = n;
					return r
				} else {
					debugger;
					r = e;
					return r
				}
			} else {
				return ""
			}
		},
		dateTime: function (e) {
			if (e !== null) {
				return e.getDate() + "." + (e.getMonth() + 1) + "." + e.getFullYear()
			}
		},
		getType: function (e) {
			debugger;
			if (e === "S") {
				return "Accept"
			} else if (e === "E") {
				return "Reject"
			} else {
				return "Emphasized"
			}
		},
		getIcon: function (e) {
			if (e === "S") {
				return "sap-icon://message-success"
			} else if (e === "E") {
				return "sap-icon://message-error"
			} else {
				return "sap-icon://message-warning"
			}
		},
		getStatuText: function (e) {
			if (e === "O") {
				return "A��k"
			} else if (e === "C") {
				return "Kapal�"
			} else if (e === "D") {
				return "�ptal"
			} else {
				return ""
			}
		},
		getStatuState: function (e) {
			if (e === "O") {
				return "Success"
			} else if (e === "C") {
				return "Information"
			} else if (e === "D") {
				return "Error"
			} else {
				return "None"
			}
		},
		formatQuanNoZero: function (e) {
			var r = null;
			if (e === 0) {
				return r
			} else if (e === "0") {
				return r
			} else {
				return e
			}
		}
	}
});
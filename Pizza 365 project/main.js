"use strict";
// Declare global variables

var gSelectedMenuStructure = {
    menuName: "", // S, M, L
    duongKinhCM: 0,
    suongNuong: 0,
    saladGr: 0,
    drink: 0,
    priceVND: 0,
    displayInConsoleLog: function () {},
};

var gSelectedPizzaType = {
    type: "",
    displayTypePizzaInConsole: function () {},
};

var gDiscount = 0;
var gArrayDataMenu = [];
var gOrderPizza = {
    menuDuocChon: gSelectedMenuStructure,
    loaiPizza: gSelectedPizzaType,
    loaiNuocUong: "",
    hoVaTen: "",
    email: "",
    dienThoai: 0,
    diaChi: "",
    loiNhan: "",
    voucher: "",
    phanTramGiamGia: "",
    priceActualVND: function () {
      return (
        gSelectedMenuStructure.priceVND -
        gSelectedMenuStructure.priceVND * this.phanTramGiamGia * 0.01
      );
    },
};

// Assign functions for event handlers

$(document).ready(function () {
 
    $("#btn-size-s").on("click", function () {
      onBtnPizzaSizeSmallClick();
    });
    $("#btn-size-m").on("click", function () {
      onBtnPizzaSizeMediumClick();
    });
    $("#btn-size-l").on("click", function () {
      onBtnPizzaSizeLargeClick();
    });
    $("#btn-type-ocean").on("click", function () {
      onBtnPizzaTypeOceanClick();
    });
    $("#btn-type-hawaii").on("click", function () {
      onBtnPizzaTypeHawaiiClick();
    });
    $("#btn-type-bacon").on("click", function () {
      onBtnPizzaTypeBaconClick();
    });
    $("#btn-send-order").on("click", function () {
      onBtnSendDataOrderClick();
    });
    callApiLoadDataDrinks();
    $("#modal-data-pizza").on("click", "#btn-tao-don", function () {
      onBtnTaoDonClick();
    });
});

// Declare functions for events handlers

function onBtnTaoDonClick() {

  var vOpjectCreateOrder = {
    kichCo: gSelectedMenuStructure.menuName,
    duongKinh: gSelectedMenuStructure.duongKinhCM,
    suon: gSelectedMenuStructure.suongNuong,
    salad: gSelectedMenuStructure.saladGr,
    loaiPizza: gSelectedPizzaType.type,
    idVourcher: gOrderPizza.voucher,
    idLoaiNuocUong: gOrderPizza.loaiNuocUong,
    soLuongNuoc: gSelectedMenuStructure.drink,
    hoTen: gOrderPizza.hoVaTen,
    thanhTien: gSelectedMenuStructure.priceVND,
    email: gOrderPizza.email,
    soDienThoai: gOrderPizza.dienThoai,
    diaChi: gOrderPizza.diaChi,
    loiNhan: gOrderPizza.loiNhan,
  };
  $.ajax({
    type: "POST",
    url: "http://203.171.20.210:8080/devcamp-pizza365/orders",
    contentType: "application/json",
    data: JSON.stringify(vOpjectCreateOrder),
    dataType: "json",
    success: function (response) {
      console.log(response);
      $("#modal-data-pizza").modal("hide");
      $("#inp-ordercode-modal").val(response.orderCode);
      $("#modal-display-orderid").modal("show");
    },
  });
}

function onBtnSendDataOrderClick() {
  getDataOrderByUser(gOrderPizza);
  if (validateDataOrder(gOrderPizza)) {
    if (gOrderPizza.voucher != "") {
      callApiCheckVoucherByID();
    } else {
      gDiscount = 0;
    }
    gOrderPizza.phanTramGiamGia = gDiscount;
    $("#modal-data-pizza").modal("show");
    displayDataToElementModal();
  }
}

 //Common used functions

function callApiCheckVoucherByID() {
  $.ajax({
    type: "GET",
    url:
      "http://203.171.20.210:8080/devcamp-pizza365/voucher_detail/" +
      gOrderPizza.voucher,
    async: false,
    dataType: "json",
    success: function (response) {
      gDiscount = response.phanTramGiamGia;
    },
  });
}

function displayDataToElementModal() {
    var vHtml = `X??c nh???n: ${gOrderPizza.hoVaTen}, ${gOrderPizza.dienThoai}, ${gOrderPizza.diaChi} \n`;
    vHtml += `Menu: ${gSelectedMenuStructure.menuName}, s?????n n?????ng: ${gSelectedMenuStructure.suongNuong}, n?????c: ${gSelectedMenuStructure.drink}, salad: ${gSelectedMenuStructure.saladGr} \n`;
    vHtml += `Lo???i Pizza: ${gSelectedPizzaType.type}, Gi??: ${gSelectedMenuStructure.priceVND}, M?? gi???m gi??: ${gOrderPizza.voucher} \n`;
    vHtml += `Ph???i thanh to??n: ${gOrderPizza.priceActualVND()} (Gi???m gi?? ${
      gOrderPizza.phanTramGiamGia
    }%)`;
    $("#inp-fullname-modal").val(gOrderPizza.hoVaTen);
    $("#inp-dienthoai-modal").val(gOrderPizza.dienThoai);
    $("#inp-diachi-modal").val(gOrderPizza.diaChi);
    $("#inp-loinhan-modal").val(gOrderPizza.loiNhan);
    $("#inp-voucher-modal").val(gOrderPizza.voucher);
    $("#textarea-infoorder-modal").val(vHtml);
}

function getDataOrderByUser(paramObjectOrder) {
    paramObjectOrder.menuDuocChon = gSelectedMenuStructure;
    paramObjectOrder.loaiPizza = gSelectedPizzaType;
    paramObjectOrder.loaiNuocUong = $("#select-drinks").val();
    paramObjectOrder.hoVaTen = $("#inp-fullname").val().trim();
    paramObjectOrder.email = $("#inp-email").val().trim();
    paramObjectOrder.dienThoai = $("#inp-dien-thoai").val().trim();
    paramObjectOrder.diaChi = $("#inp-dia-chi").val().trim();
    paramObjectOrder.loiNhan = $("#inp-message").val().trim();
    paramObjectOrder.voucher = $("#inp-voucher").val().trim();
}

function validateDataOrder(paramObjectOrder) {
    if (gSelectedMenuStructure.menuName == "") {
      alert("Vui l??ng ch???n k??ch c??? Pizza b???n mong mu???n!");
      return false;
    }
    if (gSelectedPizzaType.type == "") {
      alert("Vui l??ng ch???n v??? Pizza b???n mong mu???n!");
      return false;
    }
    if (paramObjectOrder.loaiNuocUong == "0") {
      alert("Vui l??ng ch???n n?????c u???ng m?? b???n mong mu???n");
      return false;
    }
    if (paramObjectOrder.hoVaTen == "") {
      alert("Vui l??ng nh???p t??n c???a b???n!");
      return false;
    }
    if (!validateEmail(paramObjectOrder.email)) {
      alert("Vui l??ng nh???p ????ng email c???a b???n!");
      return false;
    }
    if (!kiemTraSoDienThoai(paramObjectOrder.dienThoai)) {
      alert("Vui l??ng nh???p ????ng s??? ??i???n tho???i c???a b???n!");
      return false;
    }
    if (paramObjectOrder.diaChi == "") {
      alert("Vui l??ng nh???p ?????a ch??? c???a b???n!");
      return false;
    }
    return true;
}

// function to validate email 
function validateEmail (paramEmail) { 
    const vREG = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
    return vREG.test(String(paramEmail).toLowerCase()); }

function kiemTraSoDienThoai(paramSoDienThoai) {
    if (paramSoDienThoai == "") {
      return false;
    }
    if (isNaN(paramSoDienThoai)) {
      return false;
    }
    return true;
}

function callApiLoadDataDrinks() {
    $.ajax({
      type: "GET",
      url: "http://203.171.20.210:8080/devcamp-pizza365/drinks",
      dataType: "json",
      success: function (response) {
        displayDataDrinksToSelect(response);
      },
    });
}

function displayDataDrinksToSelect(paramResponse) {
    for (var bIndex in paramResponse) {
      var bOption = $("<option>")
        .val(paramResponse[bIndex].maNuocUong)
        .html(paramResponse[bIndex].tenNuocUong);
      $("#select-drinks").append(bOption);
    }
}

function onBtnPizzaTypeOceanClick() {
    changeColorButtonPizza("Ocean");
    gSelectedPizzaType = getDataPizzaType("Seafood");
    gSelectedPizzaType.displayTypePizzaInConsole();
}

function onBtnPizzaTypeHawaiiClick() {
    changeColorButtonPizza("Hawaii");
    gSelectedPizzaType = getDataPizzaType("HAWAII");
    gSelectedPizzaType.displayTypePizzaInConsole();
}

function onBtnPizzaTypeBaconClick() {
    changeColorButtonPizza("Bacon");
    gSelectedPizzaType = getDataPizzaType("Bacon");
    gSelectedPizzaType.displayTypePizzaInConsole();
}

function onBtnPizzaSizeSmallClick() {
    changeColorButtonPizza("Small");
    gSelectedMenuStructure = getPlan("S", 20, 2, 200, 2, 150000);
    gSelectedMenuStructure.displayInConsoleLog();
}

function onBtnPizzaSizeMediumClick() {
    changeColorButtonPizza("Medium");
    gSelectedMenuStructure = getPlan("M", 25, 4, 300, 3, 200000);
    gSelectedMenuStructure.displayInConsoleLog();
}

function onBtnPizzaSizeLargeClick() {
    changeColorButtonPizza("Large");
    gSelectedMenuStructure = getPlan("L", 30, 8, 500, 4, 250000);
    gSelectedMenuStructure.displayInConsoleLog();
}

function changeColorButtonPizza(paramPizza) {
    if (paramPizza == "Small") {
      $("#btn-size-s").removeClass().addClass("btn btn-success w-100");
      $("#btn-size-m").removeClass().addClass("btn btn-orange w-100");
      $("#btn-size-l").removeClass().addClass("btn btn-orange w-100");
    } else if (paramPizza == "Medium") {
      $("#btn-size-s").removeClass().addClass("btn btn-orange w-100");
      $("#btn-size-m").removeClass().addClass("btn btn-success w-100");
      $("#btn-size-l").removeClass().addClass("btn btn-orange w-100");
    } else if (paramPizza == "Large") {
      $("#btn-size-s").removeClass().addClass("btn btn-orange w-100");
      $("#btn-size-m").removeClass().addClass("btn btn-orange w-100");
      $("#btn-size-l").removeClass().addClass("btn btn-success w-100");
    } else if (paramPizza == "Ocean") {
      $("#btn-type-ocean").removeClass().addClass("btn btn-success w-100");
      $("#btn-type-hawaii").removeClass().addClass("btn btn-orange w-100");
      $("#btn-type-bacon").removeClass().addClass("btn btn-orange w-100");
    } else if (paramPizza == "Hawaii") {
      $("#btn-type-ocean").removeClass().addClass("btn btn-orange w-100");
      $("#btn-type-hawaii").removeClass().addClass("btn btn-success w-100");
      $("#btn-type-bacon").removeClass().addClass("btn btn-orange w-100");
    } else if (paramPizza == "Bacon") {
      $("#btn-type-ocean").removeClass().addClass("btn btn-orange w-100");
      $("#btn-type-hawaii").removeClass().addClass("btn btn-orange w-100");
      $("#btn-type-bacon").removeClass().addClass("btn btn-success w-100");
    }
}

function getPlan(
    paramMenuName,
    paramDuongKinhCM,
    paramSuongNuong,
    paramSaladGr,
    paramDrink,
    paramPriceVND
) {
    "use strict";
    gSelectedMenuStructure = {
      //?????i t?????ng: g??i d???ch v??? m??y ch??? ???????c ch???n
      menuName: paramMenuName, // S, M, L
      duongKinhCM: Number(paramDuongKinhCM),
      suongNuong: Number(paramSuongNuong),
      saladGr: Number(paramSaladGr),
      drink: Number(paramDrink),
      priceVND: Number(paramPriceVND),
      // method display plan infor - ph????ng th???c hi???n g??i pizza ???????c kh??ch h??ng ch???n
      displayInConsoleLog() {
        console.log(
          "%cPLAN SELECTED - Ph???n Pizza ???????c ch???n..........",
          "color:blue"
        );
        console.log(this.menuName); //this = "?????i t?????ng n??y"
        console.log("???????ng k??nh: " + this.duongKinhCM);
        console.log("S?????n N?????ng: " + this.suongNuong);
        console.log("Sald: " + this.saladGr);
        console.log("Drink:" + this.drink);
        console.log("Price: " + "VND " + this.priceVND);
      },
    };
    return gSelectedMenuStructure; //tr??? l???i ?????i t?????ng, c?? ????? d??? li???u (attribute) v?? c??c methods (ph????ng th???c)
}

function getDataPizzaType(paramType) {
    gSelectedPizzaType = {
      type: paramType,
      displayTypePizzaInConsole() {
        console.log(this.type);
      },
    };
    return gSelectedPizzaType;
}

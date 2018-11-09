var constructor = {
  datacoin : [],
  datacoinall : [],
  isLoading:false,
  showrow: 10,
  start:0,
  id:null
}
const url = "http://coincap.io/front";
var socket = io.connect('https://coincap.io');
window.onpopstate = function(event) {
      console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
      getElementClass("detail-coin")[0].style.display = "none";
      getElement("table-content").style.display = "block";
};
var realtimecoin  = ()=>{
  socket.on('trades', function (tradeMsg) {
      constructor.datacoin.map(function(item,index){
         if(item.short == tradeMsg.coin){
           var coinprice = parseInt(item.price);
           // getElementClass("animation")[index].style.backgroundColor = "rgb(234,255,234)";

           getElementClass("price")[index].innerHTML = `$${tradeMsg.message.msg.price}`;
           if(coinprice > tradeMsg.message.msg.price){
             getElementClass("price")[index].style.color = 'rgba(108, 168, 46, 1.0)';
             getElementClass("coin_row")[index].setAttribute("class","coin_row coin_pumb_now");
           }
           else{
             getElementClass("price")[index].style.color = "rgba(206, 92, 92, 1.0)";
             getElementClass("coin_row")[index].setAttribute("class","coin_row coin_dump_now");
           }
           getElementClass("volume24h")[index].innerHTML = "$"+format_curency(tradeMsg.message.msg.volume.toString()) ;
           getElementClass("change24h")[index].innerHTML = `${tradeMsg.message.msg.cap24hrChange}%`;
           setTimeout(()=>getElementClass("coin_row")[index].setAttribute("class","coin_row coin_default"),20)
           stylerealtime(index,item.cap24hrChange);
           return true;
         }
         return false;
      })
  })

}
var stylerealtime = (index,cap24hrChange)=>{
  var change24h = document.getElementsByClassName("change24h")[index];
  {cap24hrChange > 0 ? change24h.style.color = "rgba(108, 168, 46, 1.0)" : change24h.style.color = "rgba(206, 92, 92, 1.0)"}
}
var fetchdata = async ()=>{
  if(constructor.isLoading==false){
    console.log("dang loading....")
    document.body.style.background ="url('text-animation-1s-562x100px.gif') no-repeat fixed center";
    document.body.style.display = "none";
  }
  await fetch(url)
  .then((resp)=>resp.json())
  .then((data)=>{
    constructor.datacoinall = data;
    constructor.datacoin = data.slice(0,constructor.showrow);
    constructor.isLoading = true;
    console.log(constructor.datacoin);
  })
  .catch((err)=>console.error(err));
  if(constructor.isLoading==true){
    console.log("loading xong!")
    document.body.style.background ="unset";
    document.body.style.display = "block";
  }
  showdata();
  realtimecoin();
}
var format_curency = (text)=>{
  return text.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
var createElement = (text)=>{
  return document.createElement(text);
}
var write = (text)=>{
  return document.createTextNode(text);
}
var getElement = (text)=>{
  return document.getElementById(text);
}
var getElementClass = (text)=>{
  return document.getElementsByClassName(text);
}
var showdataitem = (start,tbody)=>{
  constructor.datacoin.map(function(item,index){
    if(index>=start){
      var tr = createElement("tr");
      tr.setAttribute("class","coin_row");
      // tr.setAttribute("id",index);
      var id = createElement("td");
      var namecoin = createElement("td");
      var marketcap = createElement("td");
      var price = createElement("td");
      price.setAttribute("class","price");
      var volume = createElement("td");
      volume.setAttribute("class","volume24h")
      var change = createElement("td");
      change.setAttribute("class","change24h");
      var span = createElement("span");
      var a = createElement("a");
      a.setAttribute("class","coin-link");
      a.addEventListener("click",function(){
        window.history.pushState(`${item.short}`, "random", `?page=${item.short}`);
        getElementClass("detail-coin")[0].style.display = "block";
        getElement("table-content").style.display = "none";
        var imagecoin = item.long.toLowerCase();
        var imagearray = imagecoin.split(" ");
        var nameimg = "";
        for(var i = 0 ; i <imagearray.length ; i++ ){
          nameimg += imagearray[i];
        }
        var span = document.getElementById("test_img");
        span.setAttribute("class",`sprite sprite-${nameimg} small_coin_logo`);
        getElementClass("rank")[0].innerHTML = index+1;
        getElementClass("name")[0].innerHTML = ` ${item.long} `;
        getElementClass("coinprice")[0].innerHTML = `$${item.price}`;
        getElementClass("coinprice")[0].setAttribute("id",`${item.short}`);
        if(item.cap24hrChange>0){
          getElementClass("24hchangecoin")[0].innerHTML = ` (${item.cap24hrChange}%) `;
          getElementClass("24hchangecoin")[0].style.color = "green";
        }
        else {
          getElementClass("24hchangecoin")[0].innerHTML = ` (${item.cap24hrChange}%) `;
          getElementClass("24hchangecoin")[0].style.color = "red";
        }
        getElementClass("mktcaprealtime")[0].innerHTML = `$${format_curency(item.mktcap.toString())}`;
        getElementClass("volumerealtime")[0].innerHTML = `$${format_curency(item.volume.toString())}`;
        getElementClass("supplyrealtime")[0].innerHTML = `$${format_curency(item.supply.toString())}`;
        constructor.id = item.short; // do đối tượng này mới làm code mất màu
        socket.on("trades",function(data){
          if(constructor.id == data.coin ){
            getElementClass("coinprice")[0].innerHTML = `$${data.message.msg.price}`;
            if(data.message.msg.cap24hrChange>0){
              getElementClass("24hchangecoin")[0].innerHTML = ` (${data.message.msg.cap24hrChange}%) `;
              getElementClass("24hchangecoin")[0].style.color = "green";
            }
            else{
              getElementClass("24hchangecoin")[0].innerHTML = ` (${data.message.msg.cap24hrChange}%) `;
              getElementClass("24hchangecoin")[0].style.color = "red";
            }

          }
        })
      })
      var div = createElement("div");
      div.setAttribute("class","coin-name");
      //a.setAttribute("href","#");
      id.appendChild(write(index+1));
      marketcap.appendChild(write("$"+format_curency(item.mktcap.toString())));
      price.appendChild(write("$"+item.price))
      volume.appendChild(write("$"+format_curency(item.volume.toString())));
      change.appendChild(write(item.cap24hrChange+"%"))
      tr.appendChild(id);
      tr.appendChild(namecoin);
      tr.appendChild(marketcap);
      tr.appendChild(price);
      tr.appendChild(volume);
      tr.appendChild(change);
      var imagecoin = item.long.toLowerCase();
      var imagearray = imagecoin.split(" ");
      var nameimg = "";
      for(var i = 0 ; i <imagearray.length ; i++ ){
        nameimg += imagearray[i];
      }
      span.setAttribute("class",`sprite sprite-${nameimg} small_coin_logo`);
      a.appendChild(write(item.long));
      div.appendChild(span);
      div.appendChild(a);
      namecoin.appendChild(div);
      tbody.appendChild(tr);
      stylerealtime(index,item.cap24hrChange);
    }
    // return console.log("khong thuc hien");
  });
}
var showdata = ()=>{
  var table = createElement("table");
  // table.style.display = "none";
  var thead = createElement("thead");
  var tbody = createElement("tbody");
  var tr = createElement("tr");
  var id = createElement("th");
  var namecoin = createElement("th");
  var marketcap = createElement("th");
  var price = createElement("th");
  var volume = createElement("th");
  var change = createElement("th");
  table.setAttribute("id","table")
  table.setAttribute("class","table table-bordered");
  //var col = document.getElementById("col-sm-12");
  id.appendChild(write("#"));
  namecoin.appendChild(write("Tên Coin"));
  marketcap.appendChild(write("Vốn hóa thị trường"));
  price.appendChild(write("Giá"))
  volume.appendChild(write("Giao dịch(24h)"));
  change.appendChild(write("Thay đổi(24h)"))
  tr.appendChild(id);
  tr.appendChild(namecoin);
  tr.appendChild(marketcap);
  tr.appendChild(price);
  tr.appendChild(volume);
  tr.appendChild(change);
  thead.appendChild(tr);
  table.appendChild(thead);
  table.appendChild(tbody);
  var col = getElement("table-content");
  col.appendChild(table);
  table.style.textAlign = 'center';
  namecoin.style.textAlign='left';
  showdataitem(constructor.start,tbody);
  lastScrollTop = 0;
  $(window).scroll(function(event){
    if($(window).scrollTop() + $(window).height() > $(document).height()-10){
      var scrollTop = $(this).scrollTop();
      if(scrollTop > lastScrollTop)
      {
        // console.log($(window).scrollTop())
        constructor.start = constructor.showrow;
        constructor.showrow+=10;
        constructor.datacoin = constructor.datacoinall.slice(0,constructor.showrow);
        console.log(constructor.datacoin);
        showdataitem(constructor.start,tbody);
      }
      lastScrollTop = scrollTop;

    }

  })
}

// 注意事项：某一个app.get/post 内，只能有一个.send/.sendFile ,否则crash . 但可以配合多个res.write(),完成多个写入HTML element.
//app.get/post 是自己是server时后的处理 :作为服务器，既要了解客户发过来的 request,也要发出response,所以callback中参数有两个，req,res
//https.get 是当自己是client时（可以假想就是个browser）时发网页链接（request)，获得网页内容（response).当作为客户时，我对自己的request当然不关心，所以callback中只有从别人那里来的response 一个参数。
//而这个response是个有许多非常多的杂乱信息（因为包含了两台电脑之间的各类通信信息。（和server 和 client之间简单的get 的 requet 基本上是一样的杂乱，道理一样）。所以：
//首先要用.on("data",function(data){}) method,只提取data. 而要利用这些data（包含在了call back 中的data参数,则需要先JSON.parse(data).后面的时候，就利用chrome的--
//--JSON viewer awesome, 简单的copy,paste。就很好用了

const express = require("express");
const https = require("https");               //Node自身模块，随node一起安装了
const bodyPaser = require("body-parser")

const app = express();
app.use(bodyPaser.urlencoded({extended:true}))


//典型的主页 ：
app.get("/",function(req,res){
res.sendFile(__dirname+"/index.html");
})

//典型的form的处理
app.post("/",function(req,res){

console.log(req.body);    //req是从客户机器发过来的，所以是个非常复杂的各类信息，但因为我们知道这是个post，所以可以轻松通过body-parser中，body提取信息。

const cityName = req.body.cityName;
const url = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName +"&appid=49873e0fa0a005a2f65361ac0cc4f372"

https.get(url,function(response){             // response是两个机器之间的信息，非常复杂的各类信息

    response.on("data",function(data){       //提取data 的方法。 method "on"
    const weatherData = JSON.parse(data)   //将数据转换为JSON格式
    temp = weatherData.main.temp           //为了防止错位，JSON的这些常路径可以用Chrome的JSON awesome addin去copy.
    weatherDescription = weatherData.weather[0].description
    icon = weatherData.weather[0].icon
    imageIcon ="http://openweathermap.org/img/wn/"+icon+"@2x.png"
    console.log(temp)
    res.write("<h1>The current weather is like " + weatherDescription +" </h1>" )
    // res.write("The current weather is like " + weatherDescription  )
    res.write("<img src="+imageIcon+ " alt=''>")   // 我们发现，如果之前的write中，没有其他HTML element, 如果单单就这一个img,则无法正常显示为HTML。即这个img是无法显示的
    res.write("now the temperature is " + temp)
    res.send()
  })

  console.log(response.statusCode)
  console.log(typeof(response))



})

})


//启用服务器：
app.listen(3000, function(){
  console.log("Server is running on port 3000")
});


// https.get('https://encrypted.google.com/', (res) => {
//   console.log('statusCode:', res.statusCode);
//   console.log('headers:', res.headers);
//
//   res.on('data', (d) => {
//     process.stdout.write(d);
//   });
//
// }).on('error', (e) => {
//   console.error(e);
// });
//

const express = require("express");
const request = require("request")


const app = express()

app.get('/list',(req,res)=>{
    console.log('Getting the list of languages');
    
   //get the list of lanuages from enumeration
   const url_lang_enum = "http://localhost:1512/rest/V1.0/enum/Enum.Language";

   const url = 'http://localhost:1512/rest/V1.0/list/Product2G/byCatalog?fields=Product2G.AclProxy,Product2G.Id,Product2G.ManufacturerName,Product2G.ProductNo,Product2GLang.DescriptionShort(en),&orderBy&formatData=false&metaData=true&startIndex=0&pageSize=100&includeLabels=true';
   var user = 'sadmin'
   var password = 'sadmin'
   var authenticationData = Buffer.from(user + ':' + password).toString('base64')
   var options = null
   var options_enum = {
    uri : url_lang_enum,
    method: "GET",
    headers:{
        "Content-Type": "application/json",
        "Authorization": "Basic " + authenticationData
    },
    json:true

}
    var languages = new Array()
    var url_qual  = "";
    request(options_enum, (er1,response_enum, body1) =>{
        //console.log("enum printing")
        //console.log(JSON.stringify(response_enum.body.entries))
        
        for (var i=0; i<response_enum.body.entries.length; i++){
            //console.log(response_enum.body.entries[i].label);
            languages.push({"label":response_enum.body.entries[i].label,"key":response_enum.body.entries[i].key});
            url_qual = url_qual + "Product2GLang.DescriptionShort("+response_enum.body.entries[i].key+"),"
        }
        console.log("language list is recieved")
        var full_url = "http://localhost:1512/rest/V1.0/list/Product2G/byCatalog?fields=Product2G.AclProxy,Product2G.Id,Product2G.ManufacturerName,Product2G.ProductNo,"+url_qual+"&orderBy&formatData=false&metaData=true&startIndex=0&pageSize=100&includeLabels=true"
        //console.log("URLLLLLLL");
        //console.log(full_url);
        console.log("calling the REST for P360")
        options = {
            uri : full_url,
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Basic " + authenticationData
            },
            json:true
     
        }
       // console.log(url_qual);
        request(options, (err, response, body) => {
       
            if (!err && response.statusCode == 200) {
               console.log("Got the result")
                //console.log(response.body.rows);
               /* var result = JSON.parse(body)
                
                //return res.send('predict_result',res1);
                */
                //res.end(JSON.stringify(response.body.rows));
                //res.render('predict_result',{"Scored_Labels": "res1_scored_lebel", "probability": "max_prediction_probability", "result": response.body.rows});
                //res.render('index', body)
               // console.log(languages)
                var list = new Array()
                for (var i=0; i<response.body.rows.length; i++){
                    //console.log("i="+i);
                    var temp = {};
                    for(var col_count=0;col_count<response.body.columns.length;col_count++){
                        //console.log(response.body.columns[col_count].name);
                        temp[""+response.body.columns[col_count].name]= response.body.rows[i].values[col_count]
                        
                        /*temp.push({
                                ["" + response.body.columns[col_count].name]: response.body.rows[i].values[10]}) */
                    } 

                    list.push(temp);
                    //console.log(response.body.column[i].name)
    
                    
                   /* list.translation = new Array()
                    for (var j=0; j<languages.length;j++){
                        list.translation.push(languages[i])
                    } */
                }
                res.end(JSON.stringify(list));
            } else {
                console.log("The request failed with status code: " + response.statusCode);
                return res.send("The request failed with status code: " + response.statusCode);
            }
        }) 
       
        
    } ) 
})


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is up on port '+port);
})

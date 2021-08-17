//================================================================================================
// Enhviando dados de temperatura e umidade para Mongodb com esp8266 via node.js
// Autor: Silas Almeida Santos
//17/08/2021
// roda no terminal node index.js
// para aplicação ctrl c
//===============================MODULOS NODE=============================================

const https = require('http');
const mongodb = require('mongodb').MongoClient

//========================================================================================
//=====================================Url do mongodb com usuario e senha=================
const url = "mongodb+srv://Monitoramento:<senhapassword>@cluster0.lwwgx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"


//=========================Função principal=================================================
var myInt= setInterval(function (){
  https.get('http://coloque o enderoço ip ou url ', (resp) => { // coloque o enderoço ip ou url http://192.0.0.10
  let data = '';
  
  // Um bloco de dados foi recebido.
  resp.on('data', (chunk) => {
    data += chunk;
  });
  
  // Toda a resposta foi recebida. Exibir o resultado.
  resp.on('end', () => {
   // console.log(JSON.parse(data).explanation);
   // console.log(data);
    let vet =data.split("e") // divide a String enviada no e
    let tempe = vet[0] + 'C°' // primeiro indice do array temperatura
    let umid = vet[1] + '%' // segundo indice do array umidade
   /* console.log(vet[0] + "C°");
    console.log(vet[1] + '%');*/

    mongodb.connect(url,(erro,bank)=>{
        if(erro)throw erro
        const dbo = bank.db("Monitoramento")
    
        const obj ={temperatura:tempe,umidade:umid} // enviar um json para o banco de dados
        const cole = 'Monitoramento'
        dbo.collection(cole).insertOne(obj,(erro,res)=>{
            if(erro)throw erro
    
            console.log('Novo dado inserido')
            bank.close()
        })//end dbo.collection
      })// end mongodb.connect

  });//end resp

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
 },2000 ) // envia para o MongoDB a cada 2 segundos
 //==========================================FIM=================================================
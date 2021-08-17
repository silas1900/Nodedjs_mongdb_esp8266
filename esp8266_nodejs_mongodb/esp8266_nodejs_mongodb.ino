#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <SimpleDHT.h>

int pinDHT11 = 14; //Sensor conectado ao pino D5
SimpleDHT11 dht11; //Criação do objeto para a biblioteca

const char* ssid = "Nome da sua rede"; ;
const char* password = "sua senha aqui"; 

ESP8266WebServer server(80);


void handleRoot() {

  byte temperature = 0;
  byte humidity = 0;
  dht11.read(pinDHT11, &temperature, &humidity, NULL);
  float temp = temperature;
  float umid = humidity;

  String umidade = String(temp);
  String temperatura = String(umid);
 
  server.send(200, "text/plain", umidade+"e"+temperatura);  // 70.0e23.0
}

void handleNotFound(){
  String message = "File Not Found\n";
  server.send(404, "text/plain", message);
}

void setup(void){
  
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }

  server.on("/", handleRoot);

  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");
}

void loop(void){
  server.handleClient();
delay(1500);

}

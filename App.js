import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Paho from "paho-mqtt";

export default function App() {
  const [estado, setEstado] = useState(false);
  const [onius, setOnius] = useState(0);

  var client = new Paho.Client("52.48.111.164", Number(8083), "/");
  client.onMessageArrived = function (message) {
    console.log(
      "Topic: " +
        message.destinationName +
        ", Message: " +
        message.payloadString
    );

    var mensaje = JSON.parse(message.payloadString);
    setOnius(message.destinationName.slice(-1));
    if (Object.keys(mensaje).length > 0) {
      if (mensaje["voltage"] == 1) {
        setEstado(true);
      } else {
        setEstado(false);
      }
    } else {
      setEstado(false);
    }
  };
  client.connect({
    onSuccess: function () {
      console.log("connected");
      client.subscribe("onius/+");
    },
    onFailure: function (err) {
      console.log("Connect failed!");
      console.log(err);
    },
    userName: "delfrom",
    password: "Passw0rd!",
    useSSL: false,
  });

  const container = {
    flex: 1,
    backgroundColor: estado == true ? "#5cb85c" : "#ed4337",
    alignItems: "center",
    justifyContent: "center",
  };

  const textStyle = {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  };
  const textStyle2 = {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    justifyContent: "top",
  };

  return (
    <View style={container}>
      <Text style={textStyle2}>Onius {onius}</Text>
      <Text style={textStyle}>
        {estado == true ? "Motor encendido" : "Motor apagado"}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

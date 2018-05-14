byte cmd_buf[10];

void setup() {
  bool success1 = Particle.function("dccCommand", dccCommand);
  Serial.begin(115200);
  Serial1.begin(9600, SERIAL_8N1);
  blink(D7, 25);

}



void loop() {

}

void blink(int pin, int times) {
   //WF_log("blink()",0);
   pinMode(pin, OUTPUT);

   for (int i=0;i<times;i++){
     delay(50);
     digitalWrite(pin,HIGH);
     delay(50);
     digitalWrite(pin,LOW);
   }
}

 int dccCommand(String orders) {
   //orders=(command,param)
    delay(250);
    int LOCO = convertCommand(orders, 1);
    int operation = convertCommand(orders, 2);
    int parameter = convertCommand(orders,3);

    Particle.publish("LOCO="+String(LOCO));
    Particle.publish("operation="+String(operation));
    Particle.publish("parameter="+String(parameter));

    int LOCO_H = 0xC0 + (LOCO >> 8);
    int LOCO_L = (LOCO & 0xFF);

    cmd_buf[0] = 0xA2;
    cmd_buf[1] = LOCO_H;
    cmd_buf[2] = LOCO_L;
    cmd_buf[3] = operation;
    cmd_buf[4] = parameter;
    Serial1.write(cmd_buf, 5);

    if (Serial1.read() == '!') {
        return 1;
    } else {
        return 0;
    }
}


int convertCommand(String orders, int index){

  int split1 = orders.indexOf(',');
  //Particle.publish("split1="+String(split1));
  int split2 = orders.lastIndexOf(',');
  //Particle.publish("split2="+String(split2));
  String add = orders.substring(0,split1);
  int engine = add.toInt();
  //Particle.publish("address="+add);
  String op = orders.substring((split1+1),split2);
  int operation = op.toInt();
  //Particle.publish("operation="+op);
  String par = orders.substring((split2+1),orders.length());
  int parameter = par.toInt();
  //Particle.publish("parameter="+par);
  if(index == 1){
    return engine;
  } else if(index == 2){
    return operation;
  } else if(index == 3){
    return parameter;
  }
}



String convertChar(char c) {
  String s = "";

  for (int i=0;i<8;i++) {
    if (c & 1) {
      s = "1" + s;
    } else {
      s = "0" + s;
    }
    c >>= 1;
  }
  return s;
}

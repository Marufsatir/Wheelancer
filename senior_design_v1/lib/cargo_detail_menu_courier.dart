import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:progress_state_button/iconed_button.dart';
import 'package:progress_state_button/progress_button.dart';
import 'package:senior_design_v1/login_page_courier.dart';

class CargoDetailMenuCourier extends StatelessWidget {
  const CargoDetailMenuCourier({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        backgroundColor: const Color(0xff81D4FA),
        resizeToAvoidBottomInset: false,
        appBar: AppBar(
          title: const Text("Cargo A Details"),
          elevation: 0,
          backgroundColor: Colors.blueAccent,
          leading: IconButton(
            onPressed: () {
              Navigator.pop(context);
            },
            icon: const Icon(
              Icons.arrow_back_ios_new,
              size: 24,
              color: Colors.black87,
            ),
          ),
        ),
        body: SafeArea(
          child: SingleChildScrollView(
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Container(
                    padding: EdgeInsets.fromLTRB(20, 50, 20, 20),
                    child: const Image(
                        image: AssetImage('assets/images/shipping.png'),
                        width: 120,
                        height: 120),
                  ),
                  Container(
                    padding: const EdgeInsets.all(20),
                    child: Text(
                      "Cargo A\n"
                          "Weight:10kg\n"
                          "Size:1x1x1m\n"
                          "Status:Being Delivered\n"
                          "Pick up Point: A\n"
                          "Destination: B\n"
                          "Delivered by: Mr. Smith\n"
                          "Fragile:Y",
                      style: TextStyle(color: Colors.black, fontSize: 20),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  const SizedBox(height: 10),
                  ElevatedButton(
                    child: Text('Cargo Location'),
                    onPressed: () {

                    },
                    style: ElevatedButton.styleFrom(
                        primary: Colors.blue,
                        padding:
                        EdgeInsets.symmetric(horizontal: 30, vertical: 10),
                        textStyle: TextStyle(
                            fontSize: 20, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 10),
                  ProgresStatefull1()
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class ProgresStatefull1 extends StatefulWidget {
  const ProgresStatefull1({Key? key}) : super(key: key);

  @override
  _ProgresStatefullState createState() => _ProgresStatefullState();
}

class _ProgresStatefullState extends State<ProgresStatefull1> {
  ButtonState stateTextWithIcon = ButtonState.idle;
  late Timer _timer;

  @override
  Widget build(BuildContext context) {
    return ProgressButton.icon(
        iconedButtons: {
          ButtonState.idle: IconedButton(
              text: "Contact The Owner",
              icon: Icon(Icons.send, color: Colors.white),
              color: Colors.blue),
          ButtonState.loading:
          IconedButton(text: "Loading", color: Colors.deepPurple.shade700),
          ButtonState.fail: IconedButton(
              text: "Failed",
              icon: Icon(Icons.cancel, color: Colors.white),
              color: Colors.red.shade300),
          ButtonState.success: IconedButton(
              text: "Success",
              icon: Icon(
                Icons.check_circle,
                color: Colors.white,
              ),
              color: Colors.green.shade400)
        },
        onPressed: () => showDialog(
            context: context,
            builder: (BuildContext builderContext) {
              _timer = Timer(Duration(seconds: 3), () {
                Navigator.pop(builderContext);
              });

              return AlertDialog(
                actionsAlignment: MainAxisAlignment.center,
                backgroundColor: Colors.blueAccent,
                title: Text('Match'),
                content: SingleChildScrollView(
                  child: Text('Please proceed to the cargo location.'),
                ),
              );
            }).then((val) {
          if (_timer.isActive) {
            _timer.cancel();
          }
        }),
        state: stateTextWithIcon);
  }
}
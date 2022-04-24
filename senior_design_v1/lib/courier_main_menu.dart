import 'dart:async';
import "package:flutter/material.dart";
import 'package:progress_state_button/iconed_button.dart';
import 'package:progress_state_button/progress_button.dart';
import 'package:senior_design_v1/courier_cargo_menu.dart';


class CourierMainMenu extends StatelessWidget {
  const CourierMainMenu({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: const Color(0xff81D4FA),
      appBar: AppBar(
        title: const Text("Welcome, abcd"),
        elevation: 0,
        backgroundColor: Colors.blueAccent,
        leading: IconButton(
            onPressed: () {
              Navigator.pop(context);
            },
            icon: const Icon(
              Icons.arrow_back_ios_new,
              size: 24,
              color: Colors.black,
            )),
        actions: <Widget>[
          IconButton(
              onPressed: () => showDialog<String>(
                context: context,
                builder: (BuildContext context) => AlertDialog(
                  title: const Text('Warning'),
                  content: const Text('Profile page is under construction!'),
                  actions: <Widget>[
                    TextButton(
                      onPressed: () => Navigator.pop(context, 'OK'),
                      child: const Text('OK'),
                    ),
                  ],
                ),
              ),
              icon: const Icon(
                Icons.account_box,
                size: 40,
                color: Colors.black,
              )),
          IconButton(
              onPressed: () => showDialog<String>(
                context: context,
                builder: (BuildContext context) => AlertDialog(
                  title: const Text('Warning'),
                  content: const Text('Settings page is under construction!'),
                  actions: <Widget>[
                    TextButton(
                      onPressed: () => Navigator.pop(context, 'OK'),
                      child: const Text('OK'),
                    ),
                  ],
                ),
              ),
              icon: const Icon(
                Icons.build_circle,
                size: 40,
                color: Colors.black,
              )),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: <Widget>[
              Padding(
                padding: EdgeInsets.fromLTRB(20, 20, 20, 20),
                child: Text(
                  'Please enter your starting and destination point',
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 20,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 60),
                child: SizedBox(
                  height: 40,
                  width: double.infinity,
                  child: ElevatedButton(
                    style: const ButtonStyle(),
                    child: const Text('Starting Point',
                        style: TextStyle(color: Colors.white, fontSize: 20)),
                    onPressed: () {

                    },
                  ),
                ),
              ),
              SizedBox(
                height: 10,
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 60),
                child: SizedBox(
                  height: 40,
                  width: double.infinity,
                  child: ElevatedButton(
                    style: const ButtonStyle(),
                    child: const Text('Destination Point',
                        style: TextStyle(color: Colors.white, fontSize: 20)),
                    onPressed: () {

                    },
                  ),
                ),
              ),
              SizedBox(height: 30),
              ProgresStatefull()
            ],
          ),
        ),
      ),
    );
  }
}

class ProgresStatefull extends StatefulWidget {
  const ProgresStatefull({Key? key}) : super(key: key);

  @override
  _ProgresStatefullState createState() => _ProgresStatefullState();
}

class _ProgresStatefullState extends State<ProgresStatefull> {
  ButtonState stateTextWithIcon = ButtonState.idle;
  late Timer _timer;

  @override
  Widget build(BuildContext context) {
    return ProgressButton.icon(
        iconedButtons: {
          ButtonState.idle: IconedButton(
              text: "Send",
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
                Navigator.of(context).pop();
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        settings: RouteSettings(name: "MainMenuForCourier"),
                        builder: (context) => CourierCargoMenu()));
              });

              return AlertDialog(
                actionsAlignment: MainAxisAlignment.center,
                backgroundColor: Colors.blueAccent,
                title: Text('Matches'),
                content: SingleChildScrollView(
                  child: Text('3 packages had been found on the route.'),
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
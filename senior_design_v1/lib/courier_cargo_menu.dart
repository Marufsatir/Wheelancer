import "package:flutter/material.dart";

import 'cargo_detail_menu_courier.dart';

class CourierCargoMenu extends StatelessWidget {
  const CourierCargoMenu({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: const Color(0xff81D4FA),
      appBar: AppBar(
        title: const Text("Welcome, Courier X"),
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
              onPressed: () {

              },
              icon: const Icon(
                Icons.account_box,
                size: 40,
                color: Colors.black,
              )),
          IconButton(
              onPressed: () {

              },
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
                padding: const EdgeInsets.fromLTRB(20, 10, 20, 10),
                child: Container(
                  width: double.infinity,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                          margin: const EdgeInsets.fromLTRB(10, 3, 10, 3),
                          child: const Icon(Icons.ramen_dining_outlined,
                              size: 64)),
                      Container(
                          margin: const EdgeInsets.all(3.0),
                          child: const Text(
                            "Cargo N\nWeight:10Kg\nSize: 10x10x10cm\nStatus: Not assigned\nDestination: X",
                            style: TextStyle(color: Colors.black, fontSize: 20),
                          )),
                      Container(
                        margin: const EdgeInsets.fromLTRB(20, 0, 0, 0),
                        child: IconButton(
                            onPressed: () {
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) =>
                                          CargoDetailMenuCourier()));
                            },
                            icon: const Icon(
                              Icons.arrow_forward_ios,
                              size: 40,
                              color: Colors.black,
                            )),
                      ),
                    ],
                  ),
                  color: const Color(0xffbdbdbd),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 10, 20, 10),
                child: Container(
                  width: double.infinity,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                          margin: const EdgeInsets.fromLTRB(10, 3, 10, 3),
                          child: const Icon(Icons.ramen_dining_outlined,
                              size: 64)),
                      Container(
                          margin: const EdgeInsets.all(3.0),
                          child: const Text(
                            "Cargo N\nWeight:10Kg\nSize: 10x10x10cm\nStatus: Not assigned\nDestination: X",
                            style: TextStyle(color: Colors.black, fontSize: 20),
                          )),
                      Container(
                        margin: const EdgeInsets.fromLTRB(20, 0, 0, 0),
                        child: IconButton(
                            onPressed: () {
                              Navigator.pop(context);
                            },
                            icon: const Icon(
                              Icons.arrow_forward_ios,
                              size: 40,
                              color: Colors.black,
                            )),
                      ),
                    ],
                  ),
                  color: const Color(0xffbdbdbd),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 10, 20, 10),
                child: Container(
                  width: double.infinity,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                          margin: const EdgeInsets.fromLTRB(10, 3, 10, 3),
                          child: const Icon(Icons.ramen_dining_outlined,
                              size: 64)),
                      Container(
                          margin: const EdgeInsets.all(3.0),
                          child: const Text(
                            "Cargo N\nWeight:10Kg\nSize: 10x10x10cm\nStatus: Not assigned\nDestination: X",
                            style: TextStyle(color: Colors.black, fontSize: 20),
                          )),
                      Container(
                        margin: const EdgeInsets.fromLTRB(20, 0, 0, 0),
                        child: IconButton(
                            onPressed: () {
                              Navigator.pop(context);
                            },
                            icon: const Icon(
                              Icons.arrow_forward_ios,
                              size: 40,
                              color: Colors.black,
                            )),
                      ),
                    ],
                  ),
                  color: const Color(0xffbdbdbd),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 10, 20, 10),
                child: Container(
                  width: double.infinity,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                          margin: const EdgeInsets.fromLTRB(10, 3, 10, 3),
                          child: const Icon(Icons.ramen_dining_outlined,
                              size: 64)),
                      Container(
                          margin: const EdgeInsets.all(3.0),
                          child: const Text(
                            "Cargo N\nWeight:10Kg\nSize: 10x10x10cm\nStatus: Not assigned\nDestination: X",
                            style: TextStyle(color: Colors.black, fontSize: 20),
                          )),
                      Container(
                        margin: const EdgeInsets.fromLTRB(20, 0, 0, 0),
                        child: IconButton(
                            onPressed: () {
                              Navigator.pop(context);
                            },
                            icon: const Icon(
                              Icons.arrow_forward_ios,
                              size: 40,
                              color: Colors.black,
                            )),
                      ),
                    ],
                  ),
                  color: const Color(0xffbdbdbd),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 10, 20, 10),
                child: Container(
                  width: double.infinity,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                          margin: const EdgeInsets.fromLTRB(10, 3, 10, 3),
                          child: const Icon(Icons.ramen_dining_outlined,
                              size: 64)),
                      Container(
                          margin: const EdgeInsets.all(3.0),
                          child: const Text(
                            "Cargo N\nWeight:10Kg\nSize: 10x10x10cm\nStatus: Not assigned\nDestination: X",
                            style: TextStyle(color: Colors.black, fontSize: 20),
                          )),
                      Container(
                        margin: const EdgeInsets.fromLTRB(20, 0, 0, 0),
                        child: IconButton(
                            onPressed: () {
                              Navigator.pop(context);
                            },
                            icon: const Icon(
                              Icons.arrow_forward_ios,
                              size: 40,
                              color: Colors.black,
                            )),
                      ),
                    ],
                  ),
                  color: const Color(0xffbdbdbd),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
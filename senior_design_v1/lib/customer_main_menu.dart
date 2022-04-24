import "package:flutter/material.dart";
import 'package:senior_design_v1/accept_courier_menu.dart';
import "package:senior_design_v1/create_cargo_menu.dart";
import 'package:senior_design_v1/cargo_detail_menu.dart';

class CustomerMainMenu extends StatelessWidget {
  const CustomerMainMenu({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: const Color(0xff81D4FA),
      floatingActionButton: FloatingActionButton(
        onPressed: ()
        {
          Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => const CreateCargoMenu()));
        },
        child: const Icon(Icons.add,size:30),
      ),
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
                padding: const EdgeInsets.fromLTRB(20,10,20,10),
                child: Container(
                  width: double.infinity,
                  child:Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                          margin: const EdgeInsets.fromLTRB(10,3,10,3),
                          child: const Icon(Icons.ramen_dining_outlined,size:64)),
                      Container(margin: const EdgeInsets.all(3.0),
                          child: const Text("Cargo N\nWeight:10Kg\nSize: 10x10x10cm\nStatus: Not assigned\nDestination: X",
                            style: TextStyle(color: Colors.black,fontSize: 20),)
                      ),
                      Container(margin:const EdgeInsets.fromLTRB(20,0,0,0),
                        child: IconButton(
                            onPressed: () {
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) => CargoDetailMenu()));
                            },
                            icon:const Icon(Icons.arrow_forward_ios,
                              size: 40,
                              color: Colors.black,)
                        ),
                      ),
                    ],
                  ),
                  color: const Color(0xff99cccc),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20,10,20,10),
                child: Container(
                  width: double.infinity,
                  child:Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                          margin: const EdgeInsets.fromLTRB(10,3,10,3),
                          child: const Icon(Icons.ramen_dining_outlined,size:64)),
                      Container(margin: const EdgeInsets.all(3.0),
                          child: const Text("Cargo N\nWeight:10Kg\nSize: 10x10x10cm\nStatus: Not assigned\nDestination: X",
                            style: TextStyle(color: Colors.black,fontSize: 20),)
                      ),
                      Container(margin:const EdgeInsets.fromLTRB(20,0,0,0),
                        child: IconButton(
                            onPressed: () {
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) => AcceptCourierMenu()));
                            },
                            icon:const Icon(Icons.arrow_forward_ios,
                              size: 40,
                              color: Colors.black,)
                        ),
                      ),
                    ],
                  ),
                  color: const Color(0xff99cccc),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20,10,20,10),
                child: Container(
                  width: double.infinity,
                  child:Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                          margin: const EdgeInsets.fromLTRB(10,3,10,3),
                          child: const Icon(Icons.ramen_dining_outlined,size:64)),
                      Container(margin: const EdgeInsets.all(3.0),
                          child: const Text("Cargo N\nWeight:10Kg\nSize: 10x10x10cm\nStatus: Not assigned\nDestination: X",
                            style: TextStyle(color: Colors.black,fontSize: 20),)
                      ),
                      Container(margin:const EdgeInsets.fromLTRB(20,0,0,0),
                      child: IconButton(
                          onPressed: () {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => CargoDetailMenu()));
                          },
                      icon:const Icon(Icons.arrow_forward_ios,
                      size: 40,
                      color: Colors.black,)
              ),
                      ),
                    ],
                  ),
                  color: const Color(0xff99cccc),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20,10,20,10),
                child: Container(
                  width: double.infinity,
                  child:Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                          margin: const EdgeInsets.fromLTRB(10,3,10,3),
                          child: const Icon(Icons.ramen_dining_outlined,size:64)),
                      Container(margin: const EdgeInsets.all(3.0),
                          child: const Text("Cargo N\nWeight:10Kg\nSize: 10x10x10cm\nStatus: Not assigned\nDestination: X",
                            style: TextStyle(color: Colors.black,fontSize: 20),)
                      ),
                      Container(margin:const EdgeInsets.fromLTRB(20,0,0,0),
                        child: IconButton(
                            onPressed: () {
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) => CargoDetailMenu()));
                            },
                            icon:const Icon(Icons.arrow_forward_ios,
                              size: 40,
                              color: Colors.black,)
                        ),
                      ),
                    ],
                  ),
                  color: const Color(0xff99cccc),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20,10,20,10),
                child: Container(
                  width: double.infinity,
                  child:Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                          margin: const EdgeInsets.fromLTRB(10,3,10,3),
                          child: const Icon(Icons.ramen_dining_outlined,size:64)),
                      Container(margin: const EdgeInsets.all(3.0),
                          child: const Text("Cargo N\nWeight:10Kg\nSize: 10x10x10cm\nStatus: Not assigned\nDestination: X",
                            style: TextStyle(color: Colors.black,fontSize: 20),)
                      ),
                      Container(margin:const EdgeInsets.fromLTRB(20,0,0,0),
                        child: IconButton(
                            onPressed: ()
                            {
                              Navigator.pop(context);
                            },
                            icon:const Icon(Icons.arrow_forward_ios,
                              size: 40,
                              color: Colors.black,)
                        ),
                      ),
                    ],
                  ),
                  color: const Color(0xff99cccc),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

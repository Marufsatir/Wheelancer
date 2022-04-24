import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:senior_design_v1/payment_menu.dart';

class AcceptCourierMenu extends StatelessWidget {
  const AcceptCourierMenu({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        backgroundColor: const Color(0xff81D4FA),
        resizeToAvoidBottomInset: false,
        appBar: AppBar(
          title: const Text("Courier A Details"),
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
                        image: AssetImage('assets/images/user.png'),
                        width: 120,
                        height: 120),
                  ),
                  Container(
                    padding: const EdgeInsets.fromLTRB(20,20,20,0),
                    child: Text(
                      "Courier X\n"
                          "Score:10\n"
                          "Member since:2005\n"
                          "Vehicle type: Car\n"
                          "Badges:\n",
                      style: TextStyle(color: Colors.black, fontSize: 20),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  Container(
                    child:Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: const <Widget>[
                        Tooltip( message: "Punctual Courier",
                          child: Icon(Icons.access_alarms,size:36.0
                            ),
                        ),
                        Tooltip( message: "Liked by other customers",
                          child: Icon(Icons.favorite,size:36.0
                          ),
                        ),
                        Tooltip( message: "Verified by the app",
                          child: Icon(Icons.gpp_good,size:36.0
                          ),
                        ),
                        ],
                    ),
                    ),

                  const SizedBox(height: 10),
                  ElevatedButton(
                    child: Text('Accept Courier'),
                    onPressed: () => showDialog<String>(
                      context: context,
                      builder: (BuildContext context) => AlertDialog(
                        title: const Text('Are you sure?'),
                        content: const Text('Your package will be delivered by Mr. X'),
                        actions: <Widget>[
                          TextButton(
                            onPressed: () => {Navigator.push(
                            context,
                            MaterialPageRoute(
                            builder: (context) => PaymentMenu()))
                            },
                            child: const Text('OK'),
                          ),
                          TextButton(
                            onPressed: () => Navigator.pop(context, 'Cancel'),
                            child: const Text('Cancel'),
                          ),
                        ],
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                        primary: Colors.blue,
                        padding:
                        EdgeInsets.symmetric(horizontal: 30, vertical: 10),
                        textStyle: TextStyle(
                            fontSize: 20, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 10),
                  ElevatedButton(
                    child: Text('Reject Courier'),
                    onPressed: () => showDialog<String>(
                      context: context,
                      builder: (BuildContext context) => AlertDialog(
                        title: const Text('Warning'),
                        content: const Text('Are you sure you want to reject Mr. X?'),
                        actions: <Widget>[
                          TextButton(
                            onPressed: () => {
                            Navigator.popUntil(context, ModalRoute.withName('MainMenuForCustomer'))
                              } ,
                               child: const Text('OK'),
                                ),
                          TextButton(
                            onPressed: () => Navigator.pop(context, 'Cancel'),
                            child: const Text('Cancel'),
                          ),
                        ],
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                        primary: Colors.blue,
                        padding:
                        EdgeInsets.symmetric(horizontal: 30, vertical: 10),
                        textStyle: TextStyle(
                            fontSize: 20, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

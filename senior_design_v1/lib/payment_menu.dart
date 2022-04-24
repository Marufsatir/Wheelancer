import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:senior_design_v1/customer_main_menu.dart';

class PaymentMenu extends StatelessWidget {
  const PaymentMenu({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        backgroundColor: const Color(0xff81D4FA),
        resizeToAvoidBottomInset: true,
        appBar: AppBar(
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
        body: SingleChildScrollView(
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 40),
            height: MediaQuery.of(context).size.height - 200,
            width: double.infinity,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                Column(
                  children: <Widget>[
                    Text(
                      'Payment Screen ',
                      style: GoogleFonts.notoSans(
                        textStyle: const TextStyle(
                            color: Colors.deepOrange,
                            letterSpacing: .5,
                            fontSize: 30),
                      ),
                    )
                  ],
                ),
                Column(
                  children: <Widget>[
                    TextField(
                        decoration: InputDecoration(
                            labelText: "Enter your credit card number"),
                        keyboardType: TextInputType.number),
                    const SizedBox(height: 10),
                    TextField(
                        decoration:
                            InputDecoration(labelText: "Validation Date"),
                        keyboardType: TextInputType.number),
                    const SizedBox(height: 10),
                    TextField(
                        decoration:
                            InputDecoration(labelText: "Enter your CVV"),
                        keyboardType: TextInputType.number),
                    const SizedBox(height: 10),
                    ElevatedButton(
                      child: Text('Confirm Payment'),
                      onPressed: () => showDialog<String>(
                        context: context,
                        builder: (BuildContext context) => AlertDialog(
                          title: const Text('Warning'),
                          content: const Text('Do you confirm the payment?'),
                          actions: <Widget>[
                            TextButton(
                              onPressed: () => showDialog<String>(
                                  context: context,
                                  builder: (BuildContext context) =>
                                      AlertDialog(
                                        title: const Text("Success!"),
                                        content: const Text(
                                            "We have received your payment. Mr. X will be at your location asap."),
                                        actions: <Widget>[
                                        TextButton(
                                          onPressed: () {
                                            Navigator.popUntil(context, ModalRoute.withName('MainMenuForCustomer'));
                                          },
                                          child: const Text("OK"),
                                        ),
                                        ],
                                      )),
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
                          padding: EdgeInsets.symmetric(
                              horizontal: 30, vertical: 10),
                          textStyle: TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

Widget textField({label, obscrity}) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      TextFormField(
        obscureText: obscrity,
        decoration: InputDecoration(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(15),
          ),
          labelText: '$label',
        ),
      ),
    ],
  );
}


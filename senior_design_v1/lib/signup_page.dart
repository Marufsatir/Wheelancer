import "package:flutter/material.dart";
import 'package:google_fonts/google_fonts.dart';
import 'wheelancer_api.dart';

class SignUpPageCustomer extends StatefulWidget {
  @override
  _SignUpPageCustomerState createState() => _SignUpPageCustomerState();
}

class _SignUpPageCustomerState extends State<SignUpPageCustomer> {
  final emailCont = TextEditingController();
  final passwordCont = TextEditingController();
  final nameCont = TextEditingController();
  final surnameCont = TextEditingController();
  final phoneNumCont = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  String message = "";
  @override
  void dispose()
  {
    emailCont.dispose();
    passwordCont.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Form(
        key: _formKey,
        child: Scaffold(
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
              height: MediaQuery.of(context).size.height - 40,
              width: double.infinity,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  Column(
                    children: <Widget>[
                      Text('Sign up ',
                          style: GoogleFonts.notoSans(
                              textStyle: const TextStyle(
                                  color: Colors.deepOrange,
                                  letterSpacing: .5,
                                  fontSize: 30)))
                    ],
                  ),
                  Column(
                    children: <Widget>[
                      textField(label: 'Name', obscrity: false,controller: nameCont),
                      const SizedBox(height: 10),
                      textField(label: 'Surname', obscrity: false,controller: surnameCont),
                      const SizedBox(height: 10),
                      textField(label: 'EMail', obscrity: false,controller: emailCont),
                      const SizedBox(height: 10),
                      textField(label: 'Phone Number', obscrity: false,controller: phoneNumCont),
                      const SizedBox(height: 10),
                      textField(label: 'Password', obscrity: true,controller: passwordCont),
                      const SizedBox(height: 10),
                      SizedBox(
                        height: 40,
                        width: double.infinity,
                        child: ElevatedButton(
                          style: const ButtonStyle(),
                          child: const Text('Sign Up',
                              style:
                              TextStyle(color: Colors.white, fontSize: 20)),
                            onPressed: () async{
                              if (_formKey.currentState!.validate()) {
                                // If the form is valid, display a snackbar. In the real world,
                                // you'd often call a server or save the information in a database.
                                var email = emailCont.text;
                                var password = passwordCont.text;
                                var surname = surnameCont.text;
                                var name = nameCont.text;
                                var phoneNumber = phoneNumCont.text;
                                var rsp = await SignUpCustomer(email,password,surname,name,phoneNumber);
                                if(rsp != null)
                                {
                                  if(rsp['type'] == 0)
                                  {
                                    Navigator.pop(context);
                                  }

                                }
                                else
                                {
                                  showAlertDialog(context);
                                }
                              }

                            },
                        ),
                      )
                    ],
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}


Widget textField({label, obscrity,controller}) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      TextFormField(
        controller: controller,
        obscureText: obscrity,
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Please enter some value';
          }
          return null;
        },
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

showAlertDialog(BuildContext context) {

  // set up the button
  Widget okButton = TextButton(
    child: Text("OK"),
    onPressed: () { Navigator.pop(context);},
  );

  // set up the AlertDialog
  AlertDialog alert = AlertDialog(
    title: Text("Error"),
    content: Text("Problem occurred during sign up, please try again!"),
    actions: [
      okButton,
    ],
  );

  // show the dialog
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return alert;
    },
  );
}
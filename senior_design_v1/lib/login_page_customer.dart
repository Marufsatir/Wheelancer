import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";
import 'package:senior_design_v1/customer_main_menu.dart';
import "package:senior_design_v1/signup_page.dart";
import "wheelancer_api.dart";
import 'package:hive/hive.dart';

class LoginPageCustomer extends StatefulWidget {
  @override
  _State createState() => _State();
}

class _State extends State<LoginPageCustomer> {
  late final Box box;
  final emailCont = TextEditingController();
  final passwordCont = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  var hideState = true;
  String message="";

  @override
  void initState() {
    super.initState();
    // Get reference to an already opened box
    box = Hive.box('wheelancerBox');
  }

  @override
  void dispose()
  {
    emailCont.dispose();
    passwordCont.dispose();
    super.dispose();
  }
  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        backgroundColor: const Color(0xff81D4FA),
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
                color: Colors.black,
              )),
        ),
        body: SafeArea(
          child: SingleChildScrollView(
            scrollDirection: Axis.vertical,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
                  child: Text(
                    "Customer Login",
                    style: GoogleFonts.notoSans(
                      textStyle: const TextStyle(
                          color: Colors.deepOrange,
                          letterSpacing: .5,
                          fontSize: 40),
                    ),
                  ),
                ),
                const SizedBox(
                  height: 20,
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 40),
                  child: TextFormField(
                    controller: emailCont,
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
                      labelText: 'Enter your email',

                    ),
                  ),
                ),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 40),
                  child: TextFormField(
                    controller: passwordCont,
                    validator: (value) {
                    if (value == null || value.isEmpty) {
                    return 'Please enter some value';
                    }
                    return null;
                    },
                  obscureText: hideState,
                  enableSuggestions: false,
                  autocorrect: false,
                  decoration: InputDecoration(
                  border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(15),
                  ),
                  labelText: 'Enter your password',
                  ),
                  ),
                  ),
                  const SizedBox(height: 30),
                  Container(
                  padding: const EdgeInsets.symmetric(horizontal: 60),
                  child: SizedBox(
                  height: 40,
                  width: double.infinity,
                  child: ElevatedButton(
                  style: const ButtonStyle(),
                  child: const Text('Login'
                  ,
                      style: TextStyle(color: Colors.white, fontSize: 20)),
                      onPressed: () async{
                                if (_formKey.currentState!.validate()) {
                                  // If the form is valid, display a snackbar. In the real world,
                                  // you'd often call a server or save the information in a database.
                                var email = emailCont.text;
                                var password = passwordCont.text;
                                setState(() {
                                  message= "Anan za baban murtaza";
                                });
                                var rsp = await LoginCustomer(email,password);
                                print(rsp);
                                if(rsp != null)
                                  {
                                    if(rsp['type'] == 0)
                                      {
                                        _addInfo(rsp['token']);
                                        Navigator.push(
                                                          context,
                                                          MaterialPageRoute(
                                                          settings:
                                                          RouteSettings(name: "MainMenuForCustomer"),
                                                          builder: (context) => CustomerMainMenu()));
                                      }

                                  }
                                else
                                {
                                  showAlertDialog(context);
                                }
                                }

                      },
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                TextButton(
                  onPressed: () {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => SignUpPageCustomer()));
                  },
                  child: const Text(
                    'Don\'t you have an account? Sign up', //title
                    textAlign: TextAlign.end, //aligment
                    style: TextStyle(color: Colors.blueGrey, fontSize: 18),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
  _addInfo(String token) async {
    box.put('token', token);
  }
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
    content: Text("Wrong Username or Password"),
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


import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";
import "package:senior_design_v1/main.dart";
import "signup_courier.dart";
import 'package:senior_design_v1/courier_main_menu.dart';

class LoginPageCourier extends StatelessWidget {
  const LoginPageCourier({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: const Color(0xff81D4FA),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.blueAccent,
        leading: IconButton(
            onPressed: ()
            {
              Navigator.pop(context);
            },
            icon:const Icon(Icons.arrow_back_ios_new,
              size: 24,
              color: Colors.black,)
        ),
      ),

      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Padding(
                padding:const EdgeInsets.fromLTRB(20, 20, 20, 20),
                child: Text("Courier Login",
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
                padding: const EdgeInsets.symmetric(horizontal:40),
                child: TextFormField(
                  decoration: InputDecoration(
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                    labelText: 'Enter your username',
                  ),
                ),
              ),
              const SizedBox(height:20),
              Container(
                padding: const EdgeInsets.symmetric(horizontal:40),
                child: TextFormField(
                  obscureText: true,
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
              SizedBox(height:30),
              Container(
                padding: const EdgeInsets.symmetric(horizontal:60),
                child: SizedBox(
                  height:40,
                  width: double.infinity,
                  child: ElevatedButton(
                    style: const ButtonStyle(),
                    child: const Text('Login', style: TextStyle(color: Colors.white,fontSize: 20)),
                    onPressed: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => CourierMainMenu()));
                    },
                  ),
                ),
              ),
              SizedBox(height:20),
              TextButton(
                onPressed: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => SignUpPageCourier()));
                },
                child: const Text(
                  'Don\'t you have an account? Sign up', //title
                  textAlign: TextAlign.end, //aligment
                  style: TextStyle(color: Colors.blueGrey,fontSize: 18),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:senior_design_v1/login_page_courier.dart';
import 'package:senior_design_v1/login_page_customer.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';

void main() async{
  await Hive.initFlutter();
  await Hive.openBox('wheelancerBox');
  runApp(const MaterialApp(
    home:WelcomePage(),
  ));
}

class WelcomePage extends StatelessWidget {
  const WelcomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: const Color(0xff81D4FA),
        body: SafeArea(
          child: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                Container(child: const Image(image: AssetImage('assets/images/shipping.png')),
                  height: 100,
                ),
                Text(
                  "Wheelancer",
                  style: GoogleFonts.notoSans(
                    textStyle: const TextStyle(
                        color: Colors.deepOrange,
                        letterSpacing: .5,
                        fontSize: 56),
                  ),
                ),


                const SizedBox(
                  height: 20,
                ),
                Container(
                  width: 350,
                  child: MaterialButton(
                      color: Colors.white,
                      minWidth: double.infinity,
                      height: 60,
                      shape: RoundedRectangleBorder(
                        side: const BorderSide(
                          color: Colors.black,
                        ),
                        borderRadius: BorderRadius.circular(40),
                      ),
                      child: Text('Customer',
                          style: GoogleFonts.notoSans(
                            textStyle: const TextStyle(
                                color: Color(0xff1565C0),
                                letterSpacing: .5,
                                fontSize: 32),
                          )),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) =>  LoginPageCustomer()),
                        );
                      }),
                ),
                const SizedBox(
                  height: 20,
                ),
                Container(
                  width: 350,
                  child: MaterialButton(
                      color: Colors.white,
                      minWidth: double.infinity,
                      height: 60,
                      shape: RoundedRectangleBorder(
                        side: const BorderSide(
                          color: Colors.black,
                        ),
                        borderRadius: BorderRadius.circular(40),
                      ),
                      child: Text('Courier',
                          style: GoogleFonts.notoSans(
                            textStyle: const TextStyle(
                                color: Color(0xff1565C0),
                                letterSpacing: .5,
                                fontSize: 32),
                          )),
                      onPressed: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const LoginPageCourier()));
                      }),
                ),
              ],
            ),
          ),
        ),
    );
  }
}

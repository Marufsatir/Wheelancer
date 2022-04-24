import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/cupertino.dart';
import "package:flutter/material.dart";
import 'package:google_fonts/google_fonts.dart';
import 'package:senior_design_v1/login_page_courier.dart';

class SignUpPageCourier extends StatelessWidget {
  const SignUpPageCourier({Key? key}) : super(key: key);

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
            height: MediaQuery.of(context).size.height - 40,
            width: double.infinity,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                Column(
                  children: <Widget>[
                    Text(
                      'Sign up ',
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
                    textField(label: 'Name', obscrity: false),
                    const SizedBox(height: 10),
                    textField(label: 'Surname', obscrity: false),
                    const SizedBox(height: 10),
                    textField(label: 'EMail', obscrity: false),
                    const SizedBox(height: 10),
                    textField(label: 'Phone Number', obscrity: false),
                    const SizedBox(height: 10),
                    textField(label: 'Password', obscrity: true),
                    const SizedBox(height: 10),
                    Container(
                      width: 300,
                      child: ButtonTheme(
                        alignedDropdown: true,
                        child: const StateFullDropDown(),
                      ),
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    Container(
                        width: 300,
                        padding: const EdgeInsets.all(32),
                        alignment: Alignment.center,
                        child: StateFullFilePicker()),
                    SizedBox(
                      height: 40,
                      width: double.infinity,
                      child: ElevatedButton(
                        style: const ButtonStyle(),
                        child: const Text('Sign Up',
                            style:
                                TextStyle(color: Colors.white, fontSize: 20)),
                        onPressed: () {
                          Navigator.pop(context);
                        },
                      ),
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

class StateFullDropDown extends StatefulWidget {
  const StateFullDropDown({Key? key}) : super(key: key);

  @override
  _stateFullDropDownState createState() => _stateFullDropDownState();
}

class _stateFullDropDownState extends State<StateFullDropDown> {
  String dropDownValue = 'Car';
  @override
  Widget build(BuildContext context) {
    return DropdownButton<String>(
      isExpanded: true,
      value: dropDownValue,
      icon: const Icon(Icons.arrow_downward),
      elevation: 20,
      style: const TextStyle(color: Colors.deepPurple),
      underline: Container(
        height: 1,
        color: Colors.deepPurpleAccent,
      ),
      onChanged: (String? newValue) {
        setState(() {
          dropDownValue = newValue!;
        });
      },
      items: <String>['Car', 'Motorcycle', 'Truck']
          .map<DropdownMenuItem<String>>((String value) {
        return DropdownMenuItem<String>(
          value: value,
          child: Text(value),
        );
      }).toList(),
    );
  }
}

class StateFullFilePicker extends StatefulWidget {
  const StateFullFilePicker({Key? key}) : super(key: key);

  @override
  _stateFullFilePickerState createState() => _stateFullFilePickerState();
}

class _stateFullFilePickerState extends State<StateFullFilePicker> {
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      child: const Text(
        'Upload Driver License',
        style: TextStyle(
            color: Colors.white, letterSpacing: .5, fontSize: 16),
      ),
      onPressed: selectFile,
    );
  }

  Future selectFile() async {
    File? file;
    final result = await FilePicker.platform.pickFiles(allowMultiple: false);

    if (result == null) return;
    final path = result.files.single.path!;

    setState(() => file = File(path));
  }
}

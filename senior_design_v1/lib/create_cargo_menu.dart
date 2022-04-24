import 'package:file_picker/file_picker.dart';
import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";
import 'dart:io';

class CreateCargoMenu extends StatelessWidget {
  const CreateCargoMenu({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        home:Scaffold(
      backgroundColor: const Color(0xff81D4FA),
      resizeToAvoidBottomInset: false,
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
                    'Create Cargo ',
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
                  textField(label: 'Weight', obscrity: false),
                  const SizedBox(height: 10),
                  textField(label: 'Size', obscrity: false),
                  const SizedBox(height: 10),
                  textField(label: 'Starting Address', obscrity: false),
                  const SizedBox(height: 10),
                  textField(label: 'Destination Address', obscrity: false),
                  const SizedBox(height: 10),
                  Container(
                    width: 300,
                    child: ButtonTheme(
                      alignedDropdown: true,
                      child: Container(
                          width: 400,
                          child: const StateFullDropDown()),
                    ),
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
                      child: const Text('Create Cargo',
                          style: TextStyle(color: Colors.white, fontSize: 20)),
                      onPressed: () {
                        Navigator.popUntil(context, ModalRoute.withName('MainMenuForCustomer'));
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
  String dropDownValue = 'Fragile:Yes';
  @override
  Widget build(BuildContext context) {
    return DropdownButton<String>(
      isExpanded: true,
      hint: Text("Fragile"),
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
      items:
          <String>['Fragile:Yes', 'Fragile:No'].map<DropdownMenuItem<String>>((String value) {
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
        'Upload Photo',
        style: TextStyle(color: Colors.white, letterSpacing: .5, fontSize: 16),
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

import 'package:http/http.dart' as http;
import 'dart:convert';

Future LoginCustomer(String username, String password) async
{
  var url = Uri.parse('http://wheelancer.ddns.net:3013/user/login');
  var response = await http.post(url, headers: {"Content-Type": "application/json"}, body: json.encode({'username': username, 'password': password}));
  if(response.statusCode == 200 ) {
    var decodedJsonResponse = jsonDecode(response.body.toString());
    return decodedJsonResponse;
  }
  else{
    return null;
  }
}

Future SignUpCustomer(String email, String password, String surname, String name, String phoneNumber) async
{
  var url = Uri.parse('http://wheelancer.ddns.net:3013/user/register');
  var response = await http.post(url, headers: {"Content-Type": "application/json"},
              body: json.encode({'username': surname,
                'email': email,
                'name':name,
             'password': password,
              'type':0}));
  if(response.statusCode == 200 ) {
    var decodedJsonResponse = jsonDecode(response.body.toString());
    return decodedJsonResponse;
  }
  else{
    return null;
  }
}
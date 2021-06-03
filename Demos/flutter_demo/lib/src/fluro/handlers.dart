
import 'package:fluro/fluro.dart';
import 'package:flutter/material.dart';
import '../components/redux_text/test.dart';
import '../components/login/mesh_login.dart';
import '../components/redux_text/screen2.dart';
import '../components/login/sign_in.dart';
import '../components/login/sign_up.dart';

var rootHandler = new Handler(
    handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return new SignIn();
});

var testHandler = new Handler(handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return new Screen();
});

var screen2Handler = new Handler(handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return new NextScreen();
});

var loginHandler = new Handler(handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return new Login();
});

var signInHandler = new Handler(handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return new SignIn();
});

var signUpHandler = new Handler(handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return new SignUp();
});

import 'package:flutter/widgets.dart';
import 'package:mesh_test/src/components/login/sign_in.dart';
import 'src/components/login/mesh_login.dart';
import 'src/components/redux_text/test.dart';
import 'src/components/redux_text/screen2.dart';
import 'src/components/login/sign_in.dart';
import 'src/components/login/sign_up.dart';
import 'src/components/userInfo/user_info.dart';


class appRoutes {
  static String root = "/";
  static String test = "/test";
  static String screen2 = "/screen2";

  static String login = "/login";
  static String signIn = "/signIn";
  static String signUp = "/signUp";

  static String userInfo = "/userInfo";

  Map<String, WidgetBuilder> map(context, store) {
    return {
      root: (context) {
        return new SignIn();
      },
      login: (context) {
        return new Login();
      },
      signIn: (context) {
        return new SignIn();
      },
      signUp: (context) {
        return new SignUp();
      },
      userInfo: (context) {
        return new UserInfo();
      }
      // screen2: (context) {
      //   return new NextScreen();
      // }
      // screen2: (context) {
      //   return new Login();
      // }
    };
  }
}

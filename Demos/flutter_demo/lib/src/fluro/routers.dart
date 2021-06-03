/*
 * fluro
 * Created by Yakka
 * https://theyakka.com
 * 
 * Copyright (c) 2018 Yakka, LLC. All rights reserved.
 * See LICENSE for distribution and usage details.
 */
import 'package:fluro/fluro.dart';
import 'package:flutter/material.dart';
import './handlers.dart';

class Routes {
  static String root = "/";
  static String test = "/test";
  static String screen2 = "/screen2";

  static String login = "/login";
  static String signIn = "/signIn";
  static String signUp = "/signUp";

  static void configureRoutes(Router router) {
    router.notFoundHandler = new Handler(
        handlerFunc: (BuildContext context, Map<String, List<String>> params) {
      print("ROUTE WAS NOT FOUND !!!");
    });
    router.define(root, handler: rootHandler);
    router.define(test, handler: testHandler);
    router.define(screen2, handler: screen2Handler);
    router.define(login, handler: loginHandler);
    router.define(signIn, handler: signInHandler);
    router.define(signUp, handler: signUpHandler);
  }
}



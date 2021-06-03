import 'package:redux/redux.dart';
import 'application.dart';
import 'test.dart';
import 'items.dart';
import 'package:flutter/material.dart';

class AppState {
  TestState test;
  List<String> items;
  ApplicationState application;

  AppState(this.application, this.test, this.items);

  AppState.initState()
  {
    test = new TestState(123);
    items = ['1', '2', '3'];
    application = new ApplicationState(Locale('zh','CH'));
  }
}

AppState appStateReducer(AppState state, action) => new AppState(
  applicationReducer(state.application, action),
  testReducer(state.test, action),
  itemsReducer(state.items, action)
);


class AppStateMiddleware implements MiddlewareClass<AppState> {

  @override
  void call(Store<AppState> store, dynamic action, NextDispatcher next) {
    print("*********** UserInfoMiddleware *********** ");
    print(action);

    // Make sure to forward actions to the next middleware in the chain!
    next(action);
  }
}

class AppStateMiddleware1 implements MiddlewareClass<AppState> {

  @override
  void call(Store<AppState> store, dynamic action, NextDispatcher next) {
    print("*********** UserInfoMiddleware1 *********** ");
    print(action);

    // Make sure to forward actions to the next middleware in the chain!
    next(action);
  }
}

final List<Middleware<AppState>> middleware = [
  AppStateMiddleware(),
  AppStateMiddleware1(),
];
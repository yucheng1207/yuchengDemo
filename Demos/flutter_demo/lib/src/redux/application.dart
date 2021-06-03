import 'package:meta/meta.dart';
import 'package:redux/redux.dart';
import 'package:flutter/material.dart';

/**
 * State中所有属性都应该是只读的
 */
@immutable
class ApplicationState {
  Locale _locale;
  get locale => _locale;

  ApplicationState(this._locale);
}

class ChangeLocaleAction {
  Locale locale;
  ChangeLocaleAction(this.locale);
}

ApplicationState changeLocale(ApplicationState state, action)
{
  print(action.locale);
  return ApplicationState(action.locale);
}

Reducer<ApplicationState> applicationReducer = combineReducers<ApplicationState>([
  new TypedReducer<ApplicationState, ChangeLocaleAction>(changeLocale)
]);
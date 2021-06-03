import 'package:meta/meta.dart';
import 'package:redux/redux.dart';


class AddItemAction {
  String item;
}

class RemoveItemAction {
  String item;
}

// Start with our same type-safe, smaller reducers we had before.
List<String> addItemReducer(List<String> items, AddItemAction action) {
  print(new List.from(items));
  return new List.from(items)..add(action.item);
}

List<String> removeItemReducer(List<String> items, RemoveItemAction action) {
  return new List.from(items)..remove(action.item);
}

// Compose these smaller functions into the full `itemsReducer`.
Reducer<List<String>> itemsReducer = combineReducers<List<String>>([
  // Each `TypedReducer` will glue Actions of a certain type to the given 
  // reducer! This means you don't need to write a bunch of `if` checks 
  // manually, and can quickly scan the list of `TypedReducer`s to see what 
  // reducer handles what action.
  new TypedReducer<List<String>, AddItemAction>(addItemReducer),
  new TypedReducer<List<String>, RemoveItemAction>(removeItemReducer),
]);
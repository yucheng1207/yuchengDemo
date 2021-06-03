import 'package:meta/meta.dart';
import 'package:redux/redux.dart';

/**
 * State中所有属性都应该是只读的
 */
@immutable
class TestState {
  int _count;
  get count => _count;

  TestState(this._count);

  // TestState.initState() : _count = 0;
}

/**
 * 定义操作该State的全部Action
 * 这里只有增加count一个动作
 */
// enum Action { IncrementAction }
class IncrementAction {
  String item;
  // final TestState test;
  IncrementAction(this.item);
}

// /**
//  * reducer会根据传进来的action生成新的CountState
//  */
// TestState testReducer(TestState state, action) {
//   //匹配Action
//   if (action == Action.increment) {
//     return TestState(state.count + 1);
//   }
//   return state;
// }

TestState increment(TestState state, action)
{
  print('increment');
  print(action.item);
  return TestState(state.count + 1);
}

Reducer<TestState> testReducer = combineReducers<TestState>([
  new TypedReducer<TestState, IncrementAction>(increment)
]);
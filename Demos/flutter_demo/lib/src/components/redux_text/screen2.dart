import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import '../../redux/app_state.dart';
import '../../redux/test.dart';

class NextScreen extends StatefulWidget {
  @override
  _ScreenState createState() => _ScreenState();
}

class _ScreenState extends State<NextScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Screen'),
        leading: Row(
            children: <Widget>[
              Expanded(
                child: new BackButton()),
              Expanded(
                child: Center (
                  widthFactor: 88.0,
                  child: new Text('返回')
                ))
            ]
        ),
        automaticallyImplyLeading: true
      ),
      body: Center(
        child: new StoreBuilder<AppState>(builder: (context, store) {
          print(store.state.test.count);
          return Text(
            store.state.test.count.toString(),
            style: Theme.of(context).textTheme.display1,
          );
        })
      ),
      floatingActionButton: StoreConnector<AppState,VoidCallback>(

        converter: (store) {
          print(store.dispatch);
          return () => store.dispatch(IncrementAction('555'));
        },
        builder: (context, callback) {
          return FloatingActionButton(
            onPressed: callback,
            child: Icon(Icons.add),
          );
        },
      ),
    );
  }
}
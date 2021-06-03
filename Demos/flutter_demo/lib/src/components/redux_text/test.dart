import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import '../../redux/app_state.dart';
import './screen2.dart';
import '../../../application.dart';
import 'package:fluro/fluro.dart';
import '../../../route.dart';
import '../../fluro/routers.dart';

class Screen extends StatefulWidget {
  @override
  _ScreenState createState() => _ScreenState();
}

class _ScreenState extends State<Screen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(
      //   title: Text('Ready, Set, Shop!'),
      //   actions: <Widget>[
      //     IconButton(
      //       icon: Icon(Icons.shopping_cart),
      //       tooltip: 'Open shopping cart',
      //       onPressed: () {
      //         // Implement navigation to shopping cart page here...
      //         print('Shopping cart opened.');
      //       },
      //     ),
      //   ],
      // ),
      appBar: AppBar(
        centerTitle: false,
        // title: Text('Screen'),
        title: Row(
          children: [
            Container(
              // alignment: new FractionalOffset(0.0, 1.0),
              // padding: const EdgeInsets.fromLTRB(1, 0, 0, 0),
              transform: Matrix4.translationValues(-15, 0, 0),
              child: BackButton()
            ),
            Container(
              // alignment: new FractionalOffset(0.0, 1.0),
              // padding: const EdgeInsets.fromLTRB(1, 0, 0, 0),
              transform: Matrix4.translationValues(-26, 0, 0),
              child: Text('返回', style: TextStyle(fontSize: 14))
            ),
          ]
        ),
        // leading: new SingleChildScrollView (
        //   child: new Row(
        //     children: <Widget>[new BackButton(), new Text('返回')]
        //   )
        // ),
        // leading: Row(
        //     children: <Widget>[
        //       Expanded(
        //         child: new BackButton()),
        //       Expanded(
        //         child: Container (
        //           padding: const EdgeInsets.fromLTRB(1, 0, 0, 0),
        //           child: new Text('返回')
        //         ))
        //     ]
        // ),
        automaticallyImplyLeading: true
      ),
      body: Center(
        // child: StoreConnector<AppState,int>(
        //   converter: (store) => store.state.test.count,
        //   builder: (context, count) {
        //     return Text(
        //       count.toString(),
        //       style: Theme.of(context).textTheme.display1,
        //     );
        //   },
        // ),
        // child: StoreConnector<AppState,AppState>(
        //   converter: (store) => store.state,
        //   builder: (context, s) {
        //     return Text(
        //       s.test.count.toString(),
        //       style: Theme.of(context).textTheme.display1,
        //     );
        //   },
        // ),
        child: new StoreBuilder<AppState>(builder: (context, store) {
          print(store.state.test.count);
          return Text(
            store.state.test.count.toString(),
            style: Theme.of(context).textTheme.display1,
          );
        })
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Navigator.pushReplacementNamed(context, appRoutes.screen2);
          // Navigator.of(context).pushNamed(appRoutes.screen2);
          Navigator.pushNamed(context, appRoutes.screen2);

          // Navigator.of(context).push(MaterialPageRoute(builder: (BuildContext context){
          //   return NextScreen();
          // }));

          // var transition = (BuildContext context, Animation<double> animation,
          // Animation<double> secondaryAnimation, Widget child) {
          //   return new ScaleTransition(
          //     scale: animation,
          //     child: new RotationTransition(
          //       turns: animation,
          //       child: child,
          //     ),
          //   );
          // };
          // Application.router.navigateTo(
          //   context,
          //   Routes.screen2,
          //   transition: TransitionType.custom,
          //   transitionBuilder: transition,
          //   transitionDuration: const Duration(milliseconds: 600),
          // );

          // Application.router.navigateTo(context, Routes.screen2);
        },
        child: Icon(Icons.forward),
      ),
    );
  }
}
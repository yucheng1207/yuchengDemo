import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter/foundation.dart' show SynchronousFuture;

import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import 'src/redux/app_state.dart';

import 'src/components/redux_text/test.dart';
import 'src/components/login/mesh_login.dart';

import 'package:fluro/fluro.dart';
import 'src/fluro/routers.dart';
import './application.dart';

import 'route.dart';
import 'src/redux/application.dart';


void main() {
  final store = Store<AppState>(
    appStateReducer,
    middleware: middleware,
    initialState: AppState.initState());
  final router = new Router();
  Routes.configureRoutes(router);
  Application.router = router;
  runApp(new MyApp(store));
}


class MyApp extends StatelessWidget {
  final Store<AppState> store;
  static final route = new appRoutes();

  MyApp(this.store);

  @override
  Widget build(BuildContext context) {
    return StoreProvider<AppState>(
      store: store,
      child: new MaterialApp(
        title: 'Flutter Demo',
        // locale: store.state.application.locale,
        theme: new ThemeData(
          primaryColor: Colors.white,
          // brightness: Brightness.light,
          primarySwatch: Colors.blue,
        ),
        localizationsDelegates: [
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          DemoLocalizationsDelegate.delegate,
        ],
        supportedLocales: [
          const Locale('zh','CH'),
          const Locale('en','US'),
        ],
        // onGenerateRoute: Application.router.generator,
        // home: new Screen(),
        // home: MyHomePage(title: store.state.test.count.toString()),
        routes: route.map(context, store),
      ),
    );
  }
}


// class MyApp extends StatefulWidget {
//   final Store<AppState> store;
//   MyApp(this.store);
//   @override
//   _MyAppState createState() => new _MyAppState(this.store);
// }
 
// class _MyAppState extends State<MyApp> {
//   final Store<AppState> store;
//   static final route = new appRoutes();

//   _MyAppState(this.store);

//   @override
//   Widget build(BuildContext context) {
//     return StoreProvider<AppState>(
//       store: store,
//       child: new MaterialApp(
//         title: 'Flutter Demo',
//         locale: store.state.application.locale,
//         theme: new ThemeData(
//           primaryColor: Colors.white,
//           // brightness: Brightness.light,
//           primarySwatch: Colors.blue,
//         ),
//         localizationsDelegates: [
//           GlobalMaterialLocalizations.delegate,
//           GlobalWidgetsLocalizations.delegate,
//           DemoLocalizationsDelegate.delegate,
//         ],
//         supportedLocales: [
//           const Locale('zh','CH'),
//           const Locale('en','US'),
//         ],
//         // onGenerateRoute: Application.router.generator,
//         // home: new Screen(),
//         home: MyHomePage(title: store.state.test.count.toString()),
//         // routes: route.map(context, store),
//       ),
//     );
//   }
// }

class DemoLocalizations {
  DemoLocalizations(this.locale);

  final Locale locale;

  static DemoLocalizations of(BuildContext context) {
    return Localizations.of<DemoLocalizations>(context, DemoLocalizations);
  }

  static Map<String, Map<String, String>> _localizedValues = {
    'en': {
      'title': 'Hello World！',
      'desc': 'desc',
    },
    'zh': {
      'title': '你好！',
      'desc': '描述'
    },
  };

  String get title {
    return _localizedValues[locale.languageCode]['title'];
  }

  String get desc {
    return _localizedValues[locale.languageCode]['desc'];
  }
}

class DemoLocalizationsDelegate extends LocalizationsDelegate<DemoLocalizations>{

  const DemoLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['en','zh'].contains(locale.languageCode);
  }

  @override
  Future<DemoLocalizations> load(Locale locale) {
    print('load');
    print(locale);
    return new SynchronousFuture<DemoLocalizations>(new DemoLocalizations(locale));
  }

  @override
  bool shouldReload(LocalizationsDelegate<DemoLocalizations> old) {
    return false;
  }

  static DemoLocalizationsDelegate delegate = const DemoLocalizationsDelegate();
}

// class DemoLocalizations {
//   static Future<DemoLocalizations> load(Locale locale) {
//     final String name = locale.countryCode.isEmpty ? locale.languageCode : locale.toString();
//     final String localeName = Intl.canonicalizedLocale(name);
//     return initializeMessages(localeName).then((Null _) {
//       Intl.defaultLocale = localeName;
//       return new DemoLocalizations();
//     });
//   }

//   static DemoLocalizations of(BuildContext context) {
//     return Localizations.of<DemoLocalizations>(context, DemoLocalizations);
//   }

//   String get title {
//     return Intl.message(
//       'Hello World',
//       name: 'title',
//       desc: 'Title for the Demo application',
//     );
//   }
// }

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);
  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  bool flag = true;
  void changeLocale(store) {
    if(flag){
      DemoLocalizationsDelegate.delegate.load(Locale('zh','CH'));
      // store.dispatch(ChangeLocaleAction(Locale('zh','CH')));
    }else{
      DemoLocalizationsDelegate.delegate.load(Locale('en',"US"));
      // store.dispatch(ChangeLocaleAction(Locale('en',"US")));
    }
    flag = !flag;
  }
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
          image: DecorationImage(
        image: NetworkImage(
            'https://img.zcool.cn/community/0372d195ac1cd55a8012062e3b16810.jpg'),
        fit: BoxFit.cover,
      )),
      child: StoreBuilder<AppState>(builder: (context, store) {
        print(store.state.test.count);
        return Scaffold(
            backgroundColor: Colors.transparent, //把scaffold的背景色改成透明
            appBar: AppBar(
              centerTitle: false,
              backgroundColor: Colors.transparent, //把appbar的背景色改成透明
              // elevation: 0,//appbar的阴影
              title: Row(
                children: [new BackButton(), Text(widget.title)],
              )
            ),
            body: Center(
              child: Text(DemoLocalizations.of(context).title),
            ),
            floatingActionButton: new FloatingActionButton(
              onPressed: () => changeLocale(store),
              tooltip: DemoLocalizations.of(context).desc,
              child: new Icon(Icons.add),
            ),
        );
      })
    );
  }
}
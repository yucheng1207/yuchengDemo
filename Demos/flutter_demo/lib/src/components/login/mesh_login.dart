import 'package:flutter/material.dart';

class Login extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Code Sample for material.Scaffold',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: _MyStatefulWidget(),
    );
  }
}

class _MyStatefulWidget extends StatefulWidget {
  _MyStatefulWidget({Key key}) : super(key: key);

  @override
  _MyStatefulWidgetState createState() => _MyStatefulWidgetState();
}

class _MyStatefulWidgetState extends State<_MyStatefulWidget> {
  int _count = 0;

  Widget build(BuildContext context) {
    double width = MediaQuery.of(context).size.width;
    double height = MediaQuery.of(context).size.height;
    return Scaffold(
      // appBar: AppBar(
      //   title: Image.asset('images/logo-white.png'),
      // ),

      body: Center(
        child: Container(
          padding: new EdgeInsets.fromLTRB(0, height * 0.16, 0, height * 0),
          // margin: const EdgeInsets.all(10.0),
          decoration: new BoxDecoration(
            gradient: const LinearGradient(colors: [Color(0xcc006ba0), Color(0xbb00375a), Color(0xcc00375a), Color(0xff003355)], begin: FractionalOffset(0, 0), end: FractionalOffset(0, 1)),
            // color: Color(0xcc00375a),
            // border: Border.all(
            //     color: Color(0xff0000ff)
            // ),
            // borderRadius: BorderRadius.circular(10.0),
          ),
          width: width,
          height: height,//double.infinity,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Stack(
                children: <Widget>[
                  new Image.asset('images/logo.png', width: width, height: 176, fit: BoxFit.contain),
                  Container(
                    // color: Colors.red,
                    height: 140,
                    child: Center(child: new Image.asset('images/mesh.png', width: width * 0.6, fit: BoxFit.cover)),
                  )
                ],
              ),
              // new Image.asset('images/logo.png', width: width, fit: BoxFit.cover),
              // _MyImage(),
              // Text('You have pressed the button $_count times.'),
              // new Expanded(
              //   child: new Center(
              //     child: _MyImage()
              //   ),
              // ),
              _LoginContent(),
            ],
          ),
        )
      ),
      // bottomSheet: _LoginContent(),
      // bottomNavigationBar: BottomAppBar(
      //   child: Container(
      //     height: 50.0,
      //   ),
      // ),
      // floatingActionButton: FloatingActionButton(
      //   onPressed: () => setState(() {
      //         _count++;
      //       }),
      //   tooltip: 'Increment Counter',
      //   child: Icon(Icons.add),
      // ),
      // floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }
}

class _MyInput extends StatefulWidget {
  _MyInput({Key key}) : super(key: key);

  @override
  _MyInputState createState() => _MyInputState();
}

class _MyInputState extends State<_MyInput> {
  int _count = 0;

  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: TextField(),
      ),
    );
  }
}


class _LoginContent extends StatefulWidget {
  _LoginContent({Key key}) : super(key: key);

  @override
  _LoginContentState createState() => _LoginContentState();
}

class _LoginContentState extends State<_LoginContent> {
//手机号的控制器
  TextEditingController phoneController = TextEditingController();

  //密码的控制器
  TextEditingController passController = TextEditingController();
  Widget build(BuildContext context) {
    double width = MediaQuery.of(context).size.width;
    double height = MediaQuery.of(context).size.height;
    return Container(
      padding: new EdgeInsets.fromLTRB(width * 0.06, 66, width * 0.06, 66),
      child: Column(
        children:<Widget>[
          TextField(
            controller: phoneController,
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              contentPadding: EdgeInsets.all(10.0),
              icon: Icon(Icons.phone),
              labelText: '请输入你的用户名)',
              helperText: '请输入注册的手机号',
            ),
            autofocus: false,
          ),
          TextField(
              controller: passController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                contentPadding: EdgeInsets.all(10.0),
                icon: Icon(Icons.lock),
                labelText: '请输入密码)',
              ),
              obscureText: true),
          RaisedButton(
            onPressed: _login,
            child: Text('登录'),
          ),
        ],
      ),
    );
  }
  void _login() {
    print({'phone': phoneController.text, 'password': passController.text});
    if (phoneController.text.length != 11) {
      showDialog(
          context: context,
          builder: (context) => AlertDialog(
                title: Text('手机号码格式不对'),
              ));
    } else if (passController.text.length == 0) {
      showDialog(
          context: context,
          builder: (context) => AlertDialog(
                title: Text('请填写密码'),
              ));
    } else {
      showDialog(
          context: context,
          builder: (context) => AlertDialog(
                title: Text('登录成功'),
              ));
      phoneController.clear();
    }
  }

  void onTextClear() {
    setState(() {
      phoneController.clear();
      passController.clear();
    });
  }
}



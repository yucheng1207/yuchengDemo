import 'package:flutter/material.dart';
import '../../../route.dart';
import 'dart:convert';
import 'dart:io';

class SignIn extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xffff6f7f9),
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Row(
          children: [
            Container(
              transform: Matrix4.translationValues(-15, 0, 0),
              child: BackButton(color: Color(0xfff959fa6))
            ),
            Container(
              transform: Matrix4.translationValues(-26, 0, 0),
              child: Text('返回', style: TextStyle(fontSize: 14, color: Color(0xfff959fa6)))
            ),
          ]
        ),
      ),
      body: _CreateAccountWidget()
    );
  }
}

class _CreateAccountWidget extends StatefulWidget {
  @override
  _CreateAccountWidgetState createState() => _CreateAccountWidgetState();
}

class _CreateAccountWidgetState extends State<_CreateAccountWidget> {
  @override
  Widget build(BuildContext context) {
    return Container(
        // decoration: BoxDecoration(
        //     image: DecorationImage(
        //   image: NetworkImage(
        //       'https://img.zcool.cn/community/0372d195ac1cd55a8012062e3b16810.jpg'),
        //   fit: BoxFit.cover,
        // )),
        child: Container(
            padding: new EdgeInsets.fromLTRB(40, 32, 40, 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('登录', style: TextStyle(fontSize: 24, color: Color(0xfff0083ff))),
                Text('您的Mesh账号', style: TextStyle(fontSize: 16, color: Color(0xfff393939))),
                // Text('只需一个帐号，', style: TextStyle(fontSize: 12, color: Color(0xfffa5aab3))),
                // Text('您便可以使用 Mesh 所以产品和服务', style: TextStyle(fontSize: 12, color: Color(0xfffa5aab3))),
                _LoginContent()
              ],
            )));
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

  TextEditingController verificationController = TextEditingController();

  Widget build(BuildContext context) {
    // double width = MediaQuery.of(context).size.width;
    // double height = MediaQuery.of(context).size.height;
    return Container(
      padding: new EdgeInsets.fromLTRB(0, 32, 0, 0),
      child: Column(
        children:<Widget>[
          Container(
            padding: new EdgeInsets.fromLTRB(0, 0, 0, 20),
            child: TextField(
              // controller: phoneController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.blue),
                    borderRadius: BorderRadius.all(Radius.circular(2)),
                ),
                border: OutlineInputBorder(
                  borderSide: BorderSide(color: Color(0xfffd4d8df)),
                  borderRadius: BorderRadius.all(Radius.circular(2)),
                ),
                contentPadding: EdgeInsets.all(11.0),
                hintText: '手机号/邮箱',
                // icon: Icon(Icons.phone),
                // labelText: '手机号/邮箱',
                // helperText: '请输入手机号/邮箱',
              ),
              autofocus: false,
            ),
          ),
          Container(
            padding: new EdgeInsets.fromLTRB(0, 0, 0, 8),
            child: TextField(
              controller: passController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: Colors.blue),
                  borderRadius: BorderRadius.all(Radius.circular(2)),
                ),
                border: OutlineInputBorder(
                  borderSide: BorderSide(color: Color(0xfffd4d8df)),
                  borderRadius: BorderRadius.all(Radius.circular(2)),
                ),
                contentPadding: EdgeInsets.all(11.0),
                hintText: '密码（至少6个字符）',
                // icon: Icon(Icons.lock),
                // labelText: '密码（至少6个字符）',
              ),
              obscureText: true),
          ),
          Container(
            padding: new EdgeInsets.fromLTRB(0, 0, 0, 36),
            child: 
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  Row(
                    children: <Widget>[
                      Checkbox(
                        // materialTapTargetSize: MaterialTapTargetSize(Row)
                        value: false,
                        activeColor: Colors.blue,
                        onChanged: (bool val) {
                            // val 是布尔值
                        }
                      ),
                      Text('显示密码', style: TextStyle(fontSize: 12, color: Color(0xfffa5aab3))),
                    ]
                  ),
                  Text.rich(
                    TextSpan(text: '忘记密码？', style: TextStyle(fontSize: 12, color: Color(0xfffa5aab3)))
                  )
              ],)
          ),
          // Row(
          //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
          //   children: [
          //     Container(
          //       // padding: new EdgeInsets.fromLTRB(0, 0, 0, 8),
          //       width: 193,
          //       child: TextField(
          //         controller: verificationController,
          //         keyboardType: TextInputType.number,
          //         decoration: InputDecoration(
          //           focusedBorder: OutlineInputBorder(
          //             borderSide: BorderSide(color: Colors.blue),
          //             borderRadius: BorderRadius.all(Radius.circular(2)),
          //           ),
          //           border: OutlineInputBorder(
          //             borderSide: BorderSide(color: Color(0xfffd4d8df)),
          //             borderRadius: BorderRadius.all(Radius.circular(2)),
          //           ),
          //           contentPadding: EdgeInsets.all(11.0),
          //           hintText: '验证码',
          //           // icon: Icon(Icons.lock),
          //           // labelText: '密码（至少6个字符）',
          //         )),
          //       // child: Text('发送验证码'),
          //     ),
          //     Text('发送验证码', style: TextStyle(fontSize: 14, color: Color(0xfff0083ff))),
          // ]),
          GestureDetector(
            onTap: () {
              _login();
              // Navigator.pushNamed(context, appRoutes.userInfo);
            },
            child: 
              Container(
                // padding: new EdgeInsets.fromLTRB(36, 20, 0, 36),
                decoration: new BoxDecoration(
                  color: Color(0xfff0083ff),
                  borderRadius: BorderRadius.circular(27),
                ),
                width: 295,
                height: 48,
                child: Center(
                  child: Text('登录', style: TextStyle(fontSize: 16, color: Color(0xfffffffff))),
                )
              ),
          ),
          Container(
            padding: new EdgeInsets.fromLTRB(0, 20, 0, 36),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Text('还没Mesh账号？', style: TextStyle(fontSize: 12, color: Color(0xfff393939))),
                GestureDetector(
                  onTap: () {
                    Navigator.pushNamed(context, appRoutes.signUp);
                    print('tttt');
                  },
                  child: Text('创建一个', style: TextStyle(fontSize: 12, color: Color(0xfff0083ff))),
                ),
            ],)
          ),
        ],
      ),
    );
  }
  void _login() async {
    print({'phone': phoneController.text, 'password': passController.text});
    print(phoneController.text.length);
    // if (phoneController.text.length != 11) {
    //   showDialog(
    //       context: context,
    //       builder: (context) => AlertDialog(
    //             title: Text('手机号码格式不对'),
    //           ));
    // } else if (passController.text.length == 0) {
    //   showDialog(
    //       context: context,
    //       builder: (context) => AlertDialog(
    //             title: Text('请填写密码'),
    //           ));
    // } else {
    //   showDialog(
    //       context: context,
    //       builder: (context) => AlertDialog(
    //             title: Text('登录成功'),
    //           ));
    //   phoneController.clear();
    // }
    Locale myLocale = Localizations.localeOf(context);
    // Localizations.of<MaterialLocalizations>(context, MaterialLocalizations);
    print(myLocale);
    print(MaterialLocalizations.of(context).backButtonTooltip);
    // var url = 'https://httpbin.org/ip';
    // var httpClient = new HttpClient();
    // String result;
    // try {
    //   var request = await httpClient.getUrl(Uri.parse(url));
    //   var response = await request.close();
    //   if (response.statusCode == HttpStatus.OK) {
    //     print(response);
    //     // var json = await response.transform(UTF8.decoder).join();
    //     // var data = JSON.decode(json);
    //     var jsonTransform = await response.transform(utf8.decoder).join();
    //     var data = json.decode(jsonTransform);
    //     print(data['origin']);
    //     result = data['origin'];
    //   } else {
    //     result =
    //         'Error getting IP address:\nHttp status ${response.statusCode}';
    //   }
    // } catch (exception) {
    //   result = 'Failed getting IP address';
    // }
    Navigator.pushNamed(context, appRoutes.userInfo);
  }

  void onTextClear() {
    setState(() {
      phoneController.clear();
      passController.clear();
    });
  }
}
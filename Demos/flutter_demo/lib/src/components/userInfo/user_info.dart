import 'package:flutter/material.dart';
import '../../../route.dart';

class UserInfo extends StatelessWidget {
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
                Text('个人信息', style: TextStyle(fontSize: 24, color: Color(0xfff0083ff))),
                Text('您的Mesh账号信息', style: TextStyle(fontSize: 16, color: Color(0xfff393939))),
                Container(
                  padding: new EdgeInsets.fromLTRB(0, 32, 0, 32),
                  child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Column(
                          children: <Widget>[
                            CircleAvatar(
                              radius: 40,
                              backgroundImage: new NetworkImage("https://img.zcool.cn/community/0372d195ac1cd55a8012062e3b16810.jpg"),
                              // child: new Text("李二"),//可以在图片上添加文字等等
                            ),
                            Container(
                              padding: new EdgeInsets.fromLTRB(0, 8, 0, 0),
                              child: Text.rich(
                                TextSpan(text: '编辑头像', style: TextStyle(fontSize: 12, color: Color(0xfff0083ff)))
                              ),
                            ),
                          ],
                        ),
                        
                      ],
                    ),
                ),
                _InfoContent()
              ],
            )));
  }
}

class _InfoContent extends StatefulWidget {
  _InfoContent({Key key}) : super(key: key);

  @override
  _InfoContentState createState() => _InfoContentState();
}

class _InfoContentState extends State<_InfoContent> {
//手机号的控制器
  TextEditingController phoneController = TextEditingController();

  //密码的控制器
  TextEditingController passController = TextEditingController();

  TextEditingController verificationController = TextEditingController();

  Widget build(BuildContext context) {
    double width = MediaQuery.of(context).size.width;
    double height = MediaQuery.of(context).size.height;
    List<Map> formList = [{
      'title': '用户名',
      'subtitle': 'alicetang',
      'trailing': '修改'
    },{
      'title': '密码',
      'subtitle': '*************',
      'trailing': '重置'
    },{
      'title': '手机号',
      'subtitle': '无',
      'trailing': '绑定'
    },{
      'title': '邮箱',
      'subtitle': 'alicetang@kiwiinc.net',
      'trailing': '修改'
    }];
    Widget buildGrid() {
        List<Widget> tiles = [];//先建一个数组用于存放循环生成的widget
        Widget content; //单独一个widget组件，用于返回需要生成的内容widget
        for(var item in formList) {
            tiles.add(
                new InfoCard(title: item['title'], subtitle: item['subtitle'], trailing: item['trailing'],)
            );
        }
        content = new Column(
            children: tiles //重点在这里，因为用编辑器写Column生成的children后面会跟一个<Widget>[]，
            //此时如果我们直接把生成的tiles放在<Widget>[]中是会报一个类型不匹配的错误，把<Widget>[]删了就可以了
        );
        return content;
    }
    Widget CardsWidget = buildGrid();
    return Container(
      child: CardsWidget,
    );
  }
}

class InfoCard extends StatelessWidget {
  InfoCard({this.title, this.subtitle, this.trailing});

  final String title;
  final String subtitle;
  final String trailing;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(this.title, style: TextStyle(fontSize: 12, color: Color(0xfffa5aab3))),
        subtitle: Text(this.subtitle, style: TextStyle(fontSize: 14, color: Color(0xfff393939))),
        trailing: Text(this.trailing, style: TextStyle(fontSize: 12, color: Color(0xfff0083ff))),
      )
    );
  }
}
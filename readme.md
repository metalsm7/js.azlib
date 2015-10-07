# js.azlib

##### *java, .net, node.js 에서 특정 동작에 대해 동일한 방식으로 사용하기 위한 라이브러리입니다.*

#### 기본 자료형 클래스

* AZData<br />
1) key(string):value(object)의 형태를 가집니다. <br />
2) 동일한 키값을 여러개 가질 수 있습니다.<br />
3) key값 또는 index(입력한 순서)값으로 탐색이 가능합니다.<br />
4) 동일한 key값이 여러개인 경우, 최초로 입력된 key값에 대응하는 value값을 반환합니다.

* AZList<br />
내부적으로 List<AZData>를 가진다.

#### SQL 처리 클래스

* AZSql<br />
현재는 단순히 쿼리문에 대한 결과값 반환 처리만 가능합니다.<br />
*(현재 지원 sql서버: mysql[json_data.dll 사용], sqlite[Mono.Data.Sqlite.dll 사용])*

1) 초기화
```javascript
var azlib = require('./com.mparang.azlib.js').node;
var sql = azlib.util.AZSql.init('{"sql_type":"MSSQL_2000", "server":"127.0.0.1", "port":"1443", "id":"user", "pw":"password", "catalog":"database"}');
```
2) 쿼리 실행
'''javascript
sql.execute({"query":"SELECT 'Hello World!';", "success": null});
```
3) 쿼리 결과값 받아오기

*단일 결과값*
```c#
sql.get({"query":"SELECT id FROM user_info WHERE idx=1;';", "success": function(p_result) { var result = p_result; }});
```
*단행 결과값*
```c#
sql.getData({"query":"SELECT TOP 1 id, name, email FROM user_info WHERE idx=1;';", "success": function(p_result) { var result = p_result; }});
```
*다행 결과값*
```c#
sql.getList({"query":"SELECT TOP 5 id, name, email FROM user_info WHERE idx>=1;';", "success": function(p_result) { var result = p_result; }});
```

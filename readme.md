# 수강신청 웹사이트

일단 aws 구동하고 바로 mysql을 깔아줬다.
![참고](https://togll.tistory.com/95)

웹서버는 뭘로 할까 하다가 그냥 nodejs로 했다.
![참고](https://velog.io/@ywoosang/Node.js-%EC%84%A4%EC%B9%98)

오랜만에 처음부터 빌드하는 웹사이트라 그런지 좀 가물가물하다.
일단 구동되는건 확인했으니 페이지를 제작해보자.

npm으로 express랑 express-session, mysql을 다운받아줬다.

Chat GPT를 활용했다... 세상에

아이디는 그냥 일괄로 생성하고 비밀번호는 랜덤으로 부여해서 나눠주신다고 한다. 간단하게 학생 수랑 아이디 패스워드 넣는 폼만 만들면 될 것 같다.

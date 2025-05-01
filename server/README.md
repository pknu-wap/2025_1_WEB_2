# Web-2 BE-template

express 백엔드 템플릿입니다.

모르시는 내용 있으시면, chatgpt에 물어봐 주시고, 그래도 이해가 안될 때 물어봐 주세요. 친절하게 답하겠습니다.

## 개발 처음 세팅

윈도우 전제로 적었어요.
다른 운영체제를 사용하신다면, 말씀해 주세요.

1. Node.js의 설치 관리 도구인 Volta를 설치해요

Node.js를 설치합니다.
이미 설치되어 있으면 3번으로 가 주세요.

이 명령어는, [https://docs.volta.sh/guide/getting-started](https://docs.volta.sh/guide/getting-started) 에서 가지고 왔어요.

```sh
winget install Volta.Volta
```

2. volta로 Node.js를 설치합니다.

```sh
volta install node
```

Node.js가 설치되었습니다.

```sh
node --version
```

을 실행하고,
`v22.14.0`가 출력되는지 확인합니다.
커맨드를 찾을 수 없다고 나오면, 터미널(콘솔 창, cmd 등)을 재시작하고 다시 `node --version`을 실행해 봅니다.

3. pnpm을 설치합니다.

pnpm은 패키지 매니저라는 도구이며, 손쉽게 프로젝트에서 사용할 라이브러리 (범용적인 코드 뭉치)를 다운받을 수 있도록 도와줘요.

3-1. volta가 설치되어 있는 경우

```sh
volta install pnpm
```

을 실행합니다.

3-2. volta가 없는 경우

```sh
npm install pnpm -g
```

을 실행합니다.

4. pnpm으로 이 프로젝트가 사용하는 라이브러리를 다운받아요.

```sh
pnpm install
```

어떤 라이브러리가 설치되는지는, `package.json`를 확인해 주세요.

## 개발 시작하기


```sh
pnpm dev
```

이것을 실행하면, 개발 서버가 열려요.

## 확인할 것

개발 서버 실행중에 해 보아 주세요.

https://github.com/vi/websocat/releases
websocat이라는 websocket 테스트 툴을 다운받아요.
`Assets`을 누르고, `websocat.x86_64-pc-windows-gnu.exe` 파일을 다운받으면 되어요.

exe파일을 다운받은 폴더에서 터미널(cmd 등)을 열고, Websocket에 접속해요.
```sh
PS C:\Users\user\Downloads> .\websocat.x86_64-pc-windows-gnu.exe ws://localhost:80/api/v1
Server Connected.
```

Welcome을 쳐보면, 서버쪽 터미널에서 똑같이 

```
Listening on http://localhost:80
Welcome!

```
라고 출력될 거에요.

## 해볼 것

- 기본 통신
  - src/api/index.ts에서 메시지를 받았을 때, `ws.send`를 이용해 받은 메시지를 다시 보내봐요.
  - src/api/index.ts에서, `com#1`라는 메시지를 받으면, `ws.send`를 통해 `res#1`라는 메시지를 보내도록 해요.

- 데이터 저장 및 읽기
  - node:fs 사용법 (fs는 filesystem의 약자)를 익혀서, `com#1`라는 메시지를 받았을 때, `log.txt`에 `com#1`라는 내용이 추가되도록 해요.
    파일이 없을 때, 파일이 생성되는지 확인해야 하고, 파일이 이미 있을 때, 내용이 삭제되지 않고, 추가되어야 해요.

  https://velog.io/@goatyeonje/node.js-fs-%EB%AA%A8%EB%93%88-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0#%ED%8C%8C%EC%9D%BC-%EC%93%B0%EA%B8%B0

  - 서버를 시작할 때, `log.txt`를 읽어서, 그 내용을 출력해요. 또한, 그 내용에 `com#1`이 몇번 포함되는지 출력해 주세요.

읽어 주셔서 감사합니다. 좋은 하루 보내세요!

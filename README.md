# kubernetes-cloud

쿠버네티스 기반 클라우드 시스템 엔지니어 과정 최종 프로젝트 - 프론트엔드

## Quick start

### Create environment variables

```
NEXT_PUBLIC_BACKEND_URL=

PORT=4000
```

`.env.production`

### Start Node.js server

```shell
$ yarn dev
```

파일 변경 사항이 바로 반영되는 Next.js 웹 서버를 실행합니다.

or

```shell
$ yarn build && yarn start
```

TypeScript 파일을 JavaScript로 트랜스파일 및 최적화한 후 Next.js 웹 서버를 실행합니다.

or

```shell
$ docker-compose up --detach --build --force-recreate
```

Docker 환경에서 Node.js 웹 서버를 실행합니다.

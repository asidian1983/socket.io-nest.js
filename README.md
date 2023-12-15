# GOMBLE 서버 개발자 과제

### 개요
- 개발 플래폼 : nest.js
- 개발 언어 : typescript
- 데이터베이스 : docker - mysql
- .env : mysql 접근 정보

### 프로토콜
1. Socket_Client_ClearDatabase
  - desc : 데이터베이스 초기화
  - request param : {}

2. Socket_Client_SignUp
  - desc: 플레이어 추가
  - request param : type RequestSignUp
  
3. Socket_Client_SignIn
  - desc: 플레이어 접속 - 접속한 playerId 소켓에 입력
  - request param : type RequestSignIn

4. Socket_Client_CreateRoom
  - desc : 방 생성 후 접속
  - request param : {}

5. Socket_Server_UpdateRoom
  - desc : 방에 입장해 있을 때 변경이 일어났을 때 변경된 방 정보 발송

6. Socket_Client_JoinRoom
  - desc : 방에 입장
  - request param : type RequestJoinRoom

7. Socket_Client_LeaveRoom
  - desc : 방에서 나감 - 나가면 남은 인원에게 변경된 방 정보 `Socket_Server_UpdateRoom`로 발송
  - request param : {}

8. Socket_Client_ChangeTeam
  - desc : 팀 변경 - 변경되면 남은 인원에게 변경된 방 정보 `Socket_Server_UpdateRoom`로 발송
  - request param : type RequestChangeTeam


### 테이블 생성
CREATE TABLE `Player` (
  `playerId` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seatId` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passwd` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`playerId`),
  UNIQUE KEY `playerId_UNIQUE` (`playerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Room` (
  `roomId` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roomNumber` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`roomId`),
  UNIQUE KEY `roomId_UNIQUE` (`roomId`),
  UNIQUE KEY `roomNumber_UNIQUE` (`roomNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Seat` (
  `seatId` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roomId` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `playerId` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `teamId` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`seatId`),
  UNIQUE KEY `seatId_UNIQUE` (`seatId`),
  UNIQUE KEY `playerId_UNIQUE` (`playerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Team` (
  `teamId` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roomId` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`teamId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

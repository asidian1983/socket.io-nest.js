# GOMBLE 서버 개발자 과제

### 개요
- 개발 플래폼 : nest.js
- 개발 언어 : typescript
- 



테이블 생성
CREATE TABLE `Player` (
  `playerId` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seatId` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passwd` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`playerId`),
  UNIQUE KEY `playerId_UNIQUE` (`playerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Room` (
  `roomId` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roomNumber` int DEFAULT NULL,
  PRIMARY KEY (`roomId`),
  UNIQUE KEY `roomId_UNIQUE` (`roomId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Seat` (
  `seatId` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roomId` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `playerId` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`seatId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Team` (
  `teamId` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roomId` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`teamId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

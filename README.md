# GOMBLE 서버 개발자 과제

### 개요

- 다음 기능을 가진 클라이언트와 통신하는 Node 서버를 구현해주세요.
    1. 회원가입, 로그인
    2. 룸(Room) 만들기, 입장하기, 나가기
    3. 팀(Team) 바꾸기
- 예시 영상
    - 1개의 Room에는 2개의 Team이 존재합니다.
    - 1개의 Team에는 4개의 Seat가 존재합니다
- 아래의 라이브러리들은 필수적으로 사용하셔야 합니다.
    - typescript
    - Socket.IO
- 이외에 사용하시고 싶으신 라이브러리가 있다면 추가해서 사용하셔도 좋습니다.

### API 명세에 관한 설명

- 아래에 나오는 API 명세는 다음과 같은 형식입니다.
    
    ```jsx
    event: eventName    // socket.emit()의 1번째 인자인 이벤트 이름입니다.
    data: {             // socket.emit()의 2번째 인자인 Data입니다.
    	argument: 'A'
    }
    ack: {              // socket.emit()의 3번째 인자인 acknowledgement의 response값 입니다.
    	response: 'B'
    }
    ```
    
    - 예를 들어, 위의 명세를 따르는 코드는 다음과 같습니다.
        
        ```tsx
        socket.emit('eventName', { argument: 'A'}, ({ response }) => {
        	console.log(response) // 'B'
        })
        ```
        
- 아래에 나오는 타입들은 다음과 같습니다.
    
    ```tsx
    type Room = {
    	roomId: string
    	roomNumber: number
    	teamList: Team[]
    }
    type Team = {
    	teamId: string
    	seatList: Seat[]
    }
    type Seat = {
    	seatId: string
    	playerId: string
    }
    ```
    

### 구현해야할 기능

1. typeorm을 사용해 간단한 table 만들기
    - DB 만들기
        - DB에 Room, Team, Seat, Player 테이블을 만들어 주세요.
            
            ![erd_for_test-memory.drawio (1).png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bb2de1e8-d1ec-4dc6-b10e-09adac6f312f/erd_for_test-memory.drawio_(1).png)
            
        - 위 ERD는 추후에 기능을 하나씩 구현 하면서 변경하시면 됩니다.
    - 데이터 베이스 초기화
        - 테스트의 용이함을 위해 필요한 api입니다.
        - Client → Server
        
        ```jsx
        event: Socket_Client_ClearDatabase
        data: {}
        ack: {
        	isError: boolean
        }
        ```
        
2. 로그인 관련 기능
    - 회원가입
        - Client → Server
        
        ```jsx
        event: Socket_Client_SignUp
        data: {
        	playerId: string
        	password: string
        }
        ack: {
        	isError: boolean
        }
        ```
        
    - 로그인
        - Client → Server
        
        ```jsx
        event: Socket_Client_SignIn
        data: {
        	playerId: string
        	password: string
        }
        ack: {
        	isError: boolean
        }
        ```
        
3. 룸 관련 기능
    - 룸 만들기
        - Client → Server
        
        ```jsx
        event: Socket_Client_CreateRoom
        data: {}
        ack: {
        	isError: boolean
        }
        ```
        
        - Room이 성공적으로 만들어졌다면
            - Server → room을 만든 Client
            
            ```jsx
            event: Socket_Server_UpdateRoom
            data: {
            	room: Room
            }
            ```
            
    - 룸 입장하기
        - Client → Server
        
        ```jsx
        event: Socket_Client_JoinRoom
        data: {
        	roomNumber: number	
        }
        ack: {
        	isError: boolean
        }
        ```
        
        - Room에 성공적으로 입장했다면
            - Server → room에 먼저 입장했던 Clients
            
            ```jsx
            event: Socket_Server_UpdateRoom
            data: {
            	room: Room
            }
            ```
            
    - 룸 나가기
        - Client → Server
        
        ```jsx
        event: Socket_Client_LeaveRoom
        data: {}
        ack: {
        	isError: boolean
        }
        ```
        
        - Room을 성공적으로 나갔다면
            - Server → room에 남아있는 Clients
            
            ```jsx
            event: Socket_Server_UpdateRoom
            data: {
            	room: Room
            }
            ```
            
    - 팀 바꾸기
        - Client → Server
        
        ```jsx
        event: Socket_Client_ChangeTeam
        data: {
        	teamId: string
        }
        ack: {
        	isError: boolean
        }
        ```
        
        - 팀을 성공적으로 바꿨다면
            - Server → room에 존재하는 Clients
            
            ```jsx
            event: Socket_Server_UpdateRoom
            data: {
            	room: Room
            }
            ```
            
4. 추가 구현
    - 추가로 구현하시고 싶은 기능이 있으시면 자유롭게 기획 및 구현 해주셔도 됩니다.
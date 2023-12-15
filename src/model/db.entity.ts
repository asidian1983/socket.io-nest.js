import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 *  data base entity
 */
@Entity("Player")
export class Player {
  @PrimaryGeneratedColumn()
  playerId: string;

  @Column('varchar', { length: 45 })
  seatId: string;

  @Column('varchar', { length: 45 })
  passwd: string;
}

@Entity("Room")
export class Room {
  @PrimaryGeneratedColumn()
  roomId: string;

  @Column()
  roomNumber: number;
}

@Entity("Seat")
export class Seat {
  @PrimaryGeneratedColumn()
  seatId: string;

  @Column({ length: 45 })
  roomId: string;

  @Column({ length: 45 })
  playerId: string;

  @Column({ length: 45 })
  teamId: string;
}

@Entity("Team")
export class Team {
  @PrimaryGeneratedColumn()
  teamId: string;

  @Column({ length: 45 })
  roomId: string;
}

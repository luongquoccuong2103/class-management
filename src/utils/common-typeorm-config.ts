import { Registration } from '@/databases/entities/registration.entity';
import { Student } from '@/databases/entities/student.entity';
import { Teacher } from '@/databases/entities/teacher.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
dotenv.config({ path: './.env' });

export const db_config: TypeOrmModuleOptions & MysqlConnectionOptions = {
  type: process.env.DB_TYPE as any,
  replication: {
    master: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT as any,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    slaves: [
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT as any,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      },
    ],
  },
  logging: true,
  entities: [Teacher, Student, Registration], // this is general, later will be override by each services entities
  migrations: [], // this is general, later will be override by each services migrations
  namingStrategy: new SnakeNamingStrategy(),
  autoLoadEntities: true, //This will help auto populate entities from path like **/*.entity{.ts,.js}
  synchronize: true, // synchronize=true will auto-create all tables from your entities on connection. false mean we don't want table been override in UAT or PROD
  migrationsRun: false,
};

// console.log(db_config);
export const connectionSource = new DataSource(db_config);

export default async function insertDataWithPrimaryKeyId(
  datas: any[],
  dataSource: DataSource,
  entity: any,
) {
  const repo = await dataSource.getRepository(entity);
  await repo.save(datas);
  console.log('   Inserted ' + datas?.length + ' seed data to table ' + entity);
}

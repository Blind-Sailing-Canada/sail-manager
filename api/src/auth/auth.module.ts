import {
  forwardRef,
  Module
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';
import { ProfileModule } from '../profile/profile.module';
import { TokenModule } from '../token/token.module';
import { UserAccessModule } from '../user-access/user-access.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  exports: [AuthService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => ProfileModule),
    TokenModule,
    UserAccessModule,
    UserModule,
    forwardRef(() => FirebaseAdminModule),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
  ],
})
export class AuthModule { }

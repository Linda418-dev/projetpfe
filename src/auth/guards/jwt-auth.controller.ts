import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('jwt-auth Resource')
@ApiBearerAuth()
@Controller('jwt-auth')
export class JwtAuthController {

    @Get()
    @UseGuards(JwtAuthGuard) 
    getProtectedData(@Request() req) {
    return { message: 'Access granted', user: req.user };
    }
}

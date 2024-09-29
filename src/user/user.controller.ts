import { Controller, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
	@ApiOperation({ summary: 'Get all users' })
	findAll() {
		return this.userService.getAllUsers()
	}
  
  // TODO: add admin guard
  @Put("set_admin/:id")
	@ApiOperation({ summary: 'Set User isAdmin: true' })
  update(
		@Param('id') id: number
  ) {
		return this.userService.setUserIsAdmin(Number(id), true)
	}
}

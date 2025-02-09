import { Controller, Body, Post, UseGuards,Get, Delete, Put, Param  } from '@nestjs/common';
import { PostService } from './post.service';
import { Posts } from './post.entity';
import { Authorize } from '../authorize.guard';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post('create')
    @UseGuards(Authorize)
    async createPost(@Body() postData: Posts) {
        const post = await this.postService.createPost(postData);
        return post;
    }

    @Get()
    async getAllPost() {
        const post = await this.postService.getAllPosts();
        return post;
    }

    @Get(':id')
    @UseGuards(Authorize)
    async getOnePost(@Param('id') postId: string) {
        const post = await this.postService.getOnePost(postId);
        return post;
    }

    @Get('user/:id')
    @UseGuards(Authorize)
    async getPostOfUser(@Param('id') userId: string) {
       
        const post = await this.postService.getPostsOfUser(userId);
        return post;
    }

    @Delete(':id')
    @UseGuards(Authorize)
    async deletePost(@Param('id') postId: string) {
        const post = await this.postService.deletePost(postId);
        return post;
    }
    @Put(':id')
    @UseGuards(Authorize)
    async updatePost(@Param('id') postId: string, @Body() postData: Posts) {
        const post = await this.postService.updatePost(postId, postData);
        return post;
    }

}

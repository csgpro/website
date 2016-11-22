// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, post, put, config, route, Controller } from 'hapi-decorators';

// app
import { getPostsByCategory, getPostByPostId, savePost, deletePost } from '../../commands/post.commands';

@controller('/api/post')
class PostController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];

    @get('/')
    @config({
        auth: 'jwt'
    })
    getPostsApi(request: hapi.Request, reply: hapi.IReply) {
        let {category, published, sort, offset, limit}  = request.query;
        published = 'false' ? false : true;
        getPostsByCategory(category, published, sort, offset, limit).then(posts => {
            reply({ data: posts });
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(503, 'Bad Connection'));
            } else {
                reply(boom.create(503, err.message));
            }
        });
    }

    @get('/{id}')
    @config({
        auth: 'jwt'
    })
    getPostApi(request: hapi.Request, reply: hapi.IReply) {
        let postId = +request.params['id'];
        getPostByPostId(postId).then(post => {
            if (!post) {
                reply(boom.notFound());
                return;
            }
            reply({ data: post.toJSON() });
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(503, 'Bad Connection'));
            } else {
                reply(boom.create(503, err.message));
            }
        });
    }

    @post('/')
    @config({
        auth: 'jwt'
    })
    createPostApi(request: hapi.Request, reply: hapi.IReply) {
        let post = request.payload;
        savePost(post).then(data => {
            reply({ message: 'saved', data });
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(503, 'Bad Connection'));
            } else {
                reply(boom.create(503, err.message));
            }
        });
    }

    @put('/{id}')
    @config({
        auth: 'jwt'
    })
    updatePostApi(request: hapi.Request, reply: hapi.IReply) {
        let post = request.payload;
        savePost(post).then(data => {
            reply({ message: 'saved', data });
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(503, 'Bad Connection'));
            } else {
                reply(boom.create(503, err.message));
            }
        });
    }

    @route('delete', '/{id}')
    @config({
        auth: 'jwt'
    })
    async deletePostApi(request: hapi.Request, reply: hapi.IReply) {
        let postId = Number(request.params['id']);
        try {
            await deletePost(postId);
            reply({ message: 'Post Deleted' });
        } catch (exc) {
            if (exc.name === 'SequelizeConnectionError') {
                reply(boom.create(503, 'Bad Connection'));
            } else {
                reply(boom.create(503, exc.message));
            }
        }
    }
}

export default new PostController();
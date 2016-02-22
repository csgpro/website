'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getPost, getPostCategory } from '../commands/post.commands';

export function career(request: hapi.Request, reply: hapi.IReply) {
    getPostCategory('career').then(category => {
        reply.view('category', { title: category.getDataValue('category'), description: '', category });
    });
}

export function show(request: hapi.Request, reply: hapi.IReply) {
    let postSlug: string = request.params['slug'];
    getPost(postSlug, 'career').then(post => {
        if (!post) {
            reply(boom.notFound());
        }
        reply.view('post', post);
    });
}
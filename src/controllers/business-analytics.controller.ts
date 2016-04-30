'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { pageView } from '../modules/view-matcher';

index.sitemap = true;
export function index(request: hapi.Request, reply: hapi.IReply) {
    reply.view(pageView('business-analytics'), { title: 'Business Analytics', description: '' });
}
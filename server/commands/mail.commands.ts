// libs
import * as nodemailer from 'nodemailer';

// app
import { mailer, frankSignature } from '../shared/mailer';

let striptags = require('striptags');

interface IContactFormData {
    name: string;
    company?: string;
    phone?: string;
    email?: string;
    note: string;
}

interface IError {
    title: string;
    detail?: string;
}

export function sendContactFormEmail(formData: IContactFormData, subject = 'Contact Form Submission') {
    let promise = new Promise<nodemailer.SentMessageInfo>((resolve, reject) => {
    
        const from = 'CSG Notification <noreply@csgpro.com>';
        const to = process.env.CONTACT_FORM_EMAIL;
        
        let html = `
            ${formData.name} submitted the contact form from csgpro.com.<br>
            <br>
            Here's what they said:<br>
            <br>
            <b>Name</b><br>
            ${formData.name}<br>
            <br>
            <b>Company</b><br>
            ${formData.company || 'Not Provided'}<br>
            <br>
            <b>Phone</b><br>
            ${formData.phone || 'Not Provided'}<br>
            <br>
            <b>Email Address</b><br>
            ${formData.email || 'Not Provided'}<br>
            <br>
            <b>What they need</b><br>
            ${formData.note}<br>
            <br>
            ${frankSignature}
        `;
        
        let text = striptags(html);
        
        mailer.sendMail({ to, from, subject, html, text }, (err, info) => {
            if (err) {
                reject(err);
            } else {
                resolve(info);
            }
        });
    });
    return promise;
}

export function sendDownloadEmail(email: string, url?: string, subject = 'Your Requested Download', html?: string) {
    let promise = new Promise<nodemailer.SentMessageInfo>((resolve, reject) => {
    
        const from = 'CSG Pro <noreply@csgpro.com>';
        const to = email;
        
        if (!html) {
            if (!url) {
                reject(new Error('URL Not Provided'));
                return;
            }
            html = `
                As promised, here is the link to download the file you requested.<br>
                <br>
                <a href="${url}">${url}</a>
                <br>
            `;
        }
        
        let text = striptags(html);
        
        mailer.sendMail({ to, from, subject, html, text }, (err, info) => {
            if (err) {
                reject(err);
            } else {
                resolve(info);
            }
        });
    });
    return promise;
}
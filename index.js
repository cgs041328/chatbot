const axios = require('axios');
const axiosRetry = require('axios-retry');
const dotenv = require('dotenv');

// Extracting variables from environment
const NAME = process.env.NAME || 'Ganshen Chen';
const EMAIL = process.env.EMAIL || 'cgs041328@gmail.com';
const BASE_URL = process.env.BASE_URL || 'https://code-challenge.us1.sandbox-rivaltech.io';
const SUCCESS_MESSAGE = process.env.SUCCESS_MESSAGE || 'Thank you';
const MAX_NUMBER = 100;
const LIST_LENGTH = 3;
const STRING_LENGTH = 5;
const YES_OR_NO_KEYWORDS = ['do', 'does', 'are', 'is'];
const LIST_KEYWORDS = ['some'];
const NUMBER_KEYWORDS = ['sum', 'number'];


// Configuration
dotenv.config();
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

async function startChatbot(name, email) {
    const userId = await createAccount(name, email);
    const conversationId = await initConversation(userId);
    await retrieveMessages(conversationId);
}

// Helper function for handling try-catch blocks
async function handleRequest(requestFn, errorMessage) {
    try {
        const response = await requestFn();
        return response.data;
    } catch (error) {
        console.error(errorMessage, error.message);
        throw error;
    }
}

// Create an account
async function createAccount(name, email) {
    const registerResponse = await handleRequest(
        () =>
            axios.post(`${BASE_URL}/challenge-register`, {
                name: name,
                email: email,
            }),
        'Error creating account:'
    );

    const userId = registerResponse.user_id;
    console.log('Account created. User ID:', userId);
    return userId;
}

// Initialize the conversation
async function initConversation(userId) {
    const conversationResponse = await handleRequest(
        () =>
            axios.post(`${BASE_URL}/challenge-conversation`, {
                user_id: userId,
            }),
        'Error initializing conversation:'
    );

    const conversationId = conversationResponse.conversation_id;
    console.log('Conversation initialized. Conversation ID:', conversationId);
    return conversationId;
}

// Retrieve new messages
async function retrieveMessages(conversationId) {
    const messageResponse = await handleRequest(
        () => axios.get(`${BASE_URL}/challenge-behaviour/${conversationId}`),
        'Error retrieving new messages:'
    );

    const messages = messageResponse.messages;

    let lastMessage = '';
    if (messages && messages.length > 0) {
        lastMessage = messages[messages.length - 1].text;
        console.log('Chatbot:', lastMessage);
    }

    if (lastMessage.includes(SUCCESS_MESSAGE)) {
        return;
    }
    replyToChatbot(conversationId, lastMessage);
}

// Reply to the chatbot
async function replyToChatbot(conversationId, lastMessage) {
    let isCorrect = false;
    while (!isCorrect) {
        const content = generateReplyContent(lastMessage);
        console.log(lastMessage + content)
        const answerResponse = await handleRequest(
            () =>
                axios.post(`${BASE_URL}/challenge-behaviour/${conversationId}`, {
                    content: content,
                }),
            'Error replying to the chatbot:'
        );

        console.log(answerResponse)
        isCorrect = answerResponse.correct;
        if (isCorrect) {
            console.log('Your answer is correct! Retrieving the next message...');
            await retrieveMessages(conversationId);
            break;
        }
    }
}

// Method to generate reply content based on bot's message
function generateReplyContent(message) {
    if (YES_OR_NO_KEYWORDS.some(text => message.toLowerCase().startsWith(text))) {
        return 'yes';
    } else if (LIST_KEYWORDS.some(text => message.toLowerCase().includes(text))) {
        return generateRandomStringList(LIST_LENGTH, STRING_LENGTH);
    } else if (NUMBER_KEYWORDS.some(text => message.toLowerCase().includes(text))) {
        return Math.floor(Math.random() * MAX_NUMBER).toString();
    } else {
        return generateRandomString(STRING_LENGTH);
    }
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

function generateRandomStringList(length, stringLength) {
    const randomStringList = [];

    for (let i = 0; i < length; i++) {
        randomStringList.push(generateRandomString(stringLength));
    }

    return randomStringList;
}

// Start the application
startChatbot(NAME, EMAIL);
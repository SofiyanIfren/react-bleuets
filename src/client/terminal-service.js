import {loadStripeTerminal} from "@stripe/terminal-js";

const StripeTerminal = loadStripeTerminal();

export let discoveredReaders;
export let paymentIntentId;

export let terminal = StripeTerminal.then((t) => t.create({
    onFetchConnectionToken: fetchConnectionToken,
    onUnexpectedReaderDisconnect: unexpectedDisconnect,
}));

export function unexpectedDisconnect() { // In this function, your app should notify the user that the reader disconnected
                                  // You can also include a way to attempt to reconnect to a reader.
    console.log("Disconnected from reader")
}

export function fetchConnectionToken() {
    // Do not cache or hardcode the ConnectionToken. The SDK manages the ConnectionToken's lifecycle.
    return fetch('http://localhost:4242/connection_token', { method: "POST" })
        .then(function(response) { return response.json(); })
        .then(function(data) { return data.secret; });
}

export function discoverReaderHandler() { // Handler for a "Discover readers" button
    let config = { simulated: true };
    terminal.then(t => t.discoverReaders(config).then(function(discoverResult) {
        if (discoverResult.error) { console.log('Failed to discover: ', discoverResult.error); }
        else if (discoverResult.discoveredReaders.length === 0) { console.log('No available readers.'); }
        else {
            discoveredReaders = discoverResult.discoveredReaders;
            console.log('terminal.discoverReaders', discoveredReaders);
        }
    }));
}

export function connectReaderHandler(discoveredReaders) { // Handler for a "Connect Reader" button
    let selectedReader = discoveredReaders[0]; // Just select the first reader here
    console.log(selectedReader)
    terminal.then(t => t.connectReader(selectedReader).then(function(connectResult) {
        if (connectResult.error) { console.log('Failed to connect: ', connectResult.error); }
        else {
            console.log('Connected to reader: ', connectResult.reader.label);
            console.log('terminal.connectReader', connectResult)
        }
    }));
}

export function fetchPaymentIntentClientSecret(amount) {
    const bodyContent = JSON.stringify({ amount: amount });
    return fetch('http://localhost:4242/create_payment_intent', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: bodyContent
    })
        .then(function (response) { return response.json(); })
        .then(function (data) { return data.client_secret; });
}

export function collectPayment(amount) { // collecter les infos de la carte et traiter le paiement
    fetchPaymentIntentClientSecret(amount).then(function (client_secret) {
        console.log(client_secret)
        terminal.then(t => {
            t.collectPaymentMethod(client_secret).then(function (result) {
                if (result.error) {
                    // Placeholder for handling result.error
                    console.log(result.error)
                } else {
                    console.log('terminal.collectPaymentMethod', result.paymentIntent);
                    t.processPayment(result.paymentIntent).then(function (result) {
                        if (result.error) {
                            console.log(result.error)
                        } else if (result.paymentIntent) {
                            paymentIntentId = result.paymentIntent.id;
                            console.log('terminal.processPayment', result.paymentIntent);
                        }
                    });
                }
            });
        })
    });
}

export function capture(paymentIntentId) { // capture de paiement client
    return fetch('http://localhost:4242/capture_payment_intent', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "payment_intent_id": paymentIntentId })
    })
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log('server.capture', data);
        });
}
